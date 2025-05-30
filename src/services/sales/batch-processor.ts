
import { SaleInsert } from './types';

export interface BatchProcessingOptions {
  batchSize: number;
  maxConcurrent: number;
  retryAttempts: number;
  delayBetweenBatches: number;
}

export const defaultBatchOptions: BatchProcessingOptions = {
  batchSize: 150,
  maxConcurrent: 2,
  retryAttempts: 3,
  delayBetweenBatches: 100
};

export class BatchProcessor {
  private options: BatchProcessingOptions;
  
  constructor(options: Partial<BatchProcessingOptions> = {}) {
    this.options = { ...defaultBatchOptions, ...options };
  }
  
  createBatches<T>(data: T[]): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += this.options.batchSize) {
      batches.push(data.slice(i, i + this.options.batchSize));
    }
    return batches;
  }
  
  async processWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.options.retryAttempts) {
        throw error;
      }
      
      const waitTime = Math.min(200 * Math.pow(2, attempt - 1), 5000);
      console.log(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.processWithExponentialBackoff(operation, attempt + 1);
    }
  }
  
  async processBatchesInParallel<T>(
    batches: T[][],
    processor: (batch: T[], batchIndex: number) => Promise<void>
  ): Promise<void> {
    let totalProcessed = 0;
    const totalItems = batches.reduce((sum, batch) => sum + batch.length, 0);
    
    for (let i = 0; i < batches.length; i += this.options.maxConcurrent) {
      const currentBatches = batches.slice(i, i + this.options.maxConcurrent);
      
      const promises = currentBatches.map(async (batch, batchIndex) => {
        const globalBatchNumber = i + batchIndex + 1;
        
        await this.processWithExponentialBackoff(async () => {
          console.log(`Processing batch ${globalBatchNumber}/${batches.length} (${batch.length} items)`);
          await processor(batch, globalBatchNumber);
          totalProcessed += batch.length;
          console.log(`Batch ${globalBatchNumber} completed. Progress: ${totalProcessed}/${totalItems}`);
        });
      });
      
      await Promise.all(promises);
      
      // Delay between batch groups
      if (i + this.options.maxConcurrent < batches.length) {
        await new Promise(resolve => setTimeout(resolve, this.options.delayBetweenBatches));
      }
    }
  }
}

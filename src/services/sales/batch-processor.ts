
import { SaleInsert } from './types';

export interface BatchProcessingOptions {
  batchSize: number;
  maxConcurrent: number;
  retryAttempts: number;
  delayBetweenBatches: number;
}

export const defaultBatchOptions: BatchProcessingOptions = {
  batchSize: 75, // Reduced from 500 to 75 for better performance
  maxConcurrent: 1, // Reduced from 2 to 1 to avoid overwhelming DB
  retryAttempts: 3,
  delayBetweenBatches: 750 // Increased from 100ms to 750ms
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
      
      const waitTime = Math.min(500 * Math.pow(2, attempt - 1), 10000); // Increased base from 200ms to 500ms
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
    
    console.log(`Starting optimized batch processing: ${batches.length} batches, ${totalItems} total items`);
    console.log(`Batch size: ${this.options.batchSize}, Concurrency: ${this.options.maxConcurrent}, Delay: ${this.options.delayBetweenBatches}ms`);
    
    for (let i = 0; i < batches.length; i += this.options.maxConcurrent) {
      const currentBatches = batches.slice(i, i + this.options.maxConcurrent);
      
      const promises = currentBatches.map(async (batch, batchIndex) => {
        const globalBatchNumber = i + batchIndex + 1;
        const startTime = Date.now();
        
        await this.processWithExponentialBackoff(async () => {
          console.log(`Processing batch ${globalBatchNumber}/${batches.length} (${batch.length} items)`);
          await processor(batch, globalBatchNumber);
          totalProcessed += batch.length;
          
          const endTime = Date.now();
          const duration = endTime - startTime;
          console.log(`Batch ${globalBatchNumber} completed in ${duration}ms. Progress: ${totalProcessed}/${totalItems} (${((totalProcessed/totalItems)*100).toFixed(1)}%)`);
        });
      });
      
      await Promise.all(promises);
      
      // Enhanced delay between batch groups with progress logging
      if (i + this.options.maxConcurrent < batches.length) {
        const remainingBatches = batches.length - (i + this.options.maxConcurrent);
        console.log(`Waiting ${this.options.delayBetweenBatches}ms before next batch. Remaining: ${remainingBatches} batches`);
        await new Promise(resolve => setTimeout(resolve, this.options.delayBetweenBatches));
      }
    }
    
    console.log(`All batches completed successfully! Total processed: ${totalProcessed} items`);
  }
}

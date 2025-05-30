
import { SaleInsert } from './types';

export interface AdaptiveBatchConfig {
  batchSize: number;
  maxConcurrent: number;
  retryAttempts: number;
  delayBetweenBatches: number;
  strategy: 'small' | 'medium' | 'large';
  estimatedTimeMinutes: number;
}

export class AdaptiveBatchProcessor {
  
  static determineStrategy(totalRecords: number): AdaptiveBatchConfig {
    if (totalRecords < 1000) {
      return {
        batchSize: 200,
        maxConcurrent: 1,
        retryAttempts: 3,
        delayBetweenBatches: 250,
        strategy: 'small',
        estimatedTimeMinutes: Math.ceil(totalRecords / 200) * 0.5 // ~30s por batch
      };
    } else if (totalRecords <= 10000) {
      return {
        batchSize: 300,
        maxConcurrent: 1,
        retryAttempts: 3,
        delayBetweenBatches: 750,
        strategy: 'medium',
        estimatedTimeMinutes: Math.ceil(totalRecords / 300) * 1.2 // ~1.2min por batch
      };
    } else {
      return {
        batchSize: 150,
        maxConcurrent: 1,
        retryAttempts: 3,
        delayBetweenBatches: 1500,
        strategy: 'large',
        estimatedTimeMinutes: Math.ceil(totalRecords / 150) * 2 // ~2min por batch
      };
    }
  }

  static getStrategyDescription(strategy: string): string {
    switch (strategy) {
      case 'small':
        return 'Processamento rápido para pequenos volumes';
      case 'medium':
        return 'Processamento balanceado para volumes médios';
      case 'large':
        return 'Processamento estável para grandes volumes';
      default:
        return 'Processamento adaptativo';
    }
  }

  static createBatches<T>(data: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  }

  static async processWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    retryAttempts: number,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= retryAttempts) {
        throw error;
      }
      
      const waitTime = Math.min(500 * Math.pow(2, attempt - 1), 10000);
      console.log(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.processWithExponentialBackoff(operation, retryAttempts, attempt + 1);
    }
  }

  static async processBatchesSequentially<T>(
    batches: T[][],
    processor: (batch: T[], batchIndex: number) => Promise<void>,
    config: AdaptiveBatchConfig,
    onProgress?: (completed: number, total: number, percentage: number, strategy: string) => void
  ): Promise<void> {
    let totalProcessed = 0;
    const totalItems = batches.reduce((sum, batch) => sum + batch.length, 0);
    
    console.log(`Starting ${config.strategy} batch processing strategy:`);
    console.log(`- ${batches.length} batches`);
    console.log(`- ${totalItems} total items`);
    console.log(`- Batch size: ${config.batchSize}`);
    console.log(`- Delay: ${config.delayBetweenBatches}ms`);
    console.log(`- Estimated time: ~${config.estimatedTimeMinutes} minutes`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchNumber = i + 1;
      const startTime = Date.now();
      
      await this.processWithExponentialBackoff(async () => {
        console.log(`Processing batch ${batchNumber}/${batches.length} (${batch.length} items) - ${config.strategy} strategy`);
        await processor(batch, batchNumber);
        totalProcessed += batch.length;
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        const percentage = Math.round((totalProcessed / totalItems) * 100);
        
        console.log(`Batch ${batchNumber} completed in ${duration}ms. Progress: ${totalProcessed}/${totalItems} (${percentage}%)`);
        
        if (onProgress) {
          onProgress(totalProcessed, totalItems, percentage, config.strategy);
        }
      }, config.retryAttempts);
      
      // Delay between batches (except for the last one)
      if (i < batches.length - 1) {
        const remainingBatches = batches.length - (i + 1);
        console.log(`Waiting ${config.delayBetweenBatches}ms before next batch. Remaining: ${remainingBatches} batches`);
        await new Promise(resolve => setTimeout(resolve, config.delayBetweenBatches));
      }
    }
    
    console.log(`All batches completed successfully using ${config.strategy} strategy! Total processed: ${totalProcessed} items`);
  }
}

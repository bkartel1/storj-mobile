//
//  UploadFileRepository.m
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "UploadFileRepository.h"

#import "UploadFileContract.h"


@implementation UploadFileRepository

static NSArray * columns;

-(instancetype) initWithDB:(FMDatabase *)database {
  if (self = [super initWithDB:database]) {
    
  }
  
  return self;
}

-(NSArray *) getAll {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@",
                       [[UploadFileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       UploadFileContract.TABLE_NAME];

  __block NSMutableArray<UploadFileDbo *> * fileDboArray = [NSMutableArray<UploadFileDbo *> array];
  FMDatabaseQueue *queue =[self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request];
    if(!resultSet) {
      NSLog(@"No result set returned");
      
      return;
    }
    
    while ([resultSet next]) {
      UploadFileDbo * dbo = [UploadFileRepository getFileDboFromResultSet:resultSet];
      if(dbo) {
        [fileDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return fileDboArray;
}

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending {
  NSString *orderByColumn = columnName;
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ ORDER BY %@ %@",
                       [[UploadFileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       UploadFileContract.TABLE_NAME,
                       orderByColumn,
                       isDescending ? @"DESC" : @"ASC"];

  __block NSMutableArray<UploadFileDbo *> * fileDboArray = [NSMutableArray<UploadFileDbo *> array];
  FMDatabaseQueue *queue =[self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request];
    if(!resultSet){
      NSLog(@"No result set returned");
      
      return;
    }
    
    while ([resultSet next]) {
      UploadFileDbo * dbo = [UploadFileRepository getFileDboFromResultSet:resultSet];
      if(dbo) {
        [fileDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return fileDboArray;
}

-(UploadFileModel *) getByFileId:(NSString *) fileId {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[UploadFileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       UploadFileContract.TABLE_NAME,
                       UploadFileContract.ID];

  __block UploadFileDbo * dbo = nil;
  FMDatabaseQueue *queue =[self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request, fileId];
    if(!resultSet) {
      NSLog(@"No result set returned");
      
      return;
    }
    
    if([resultSet next]) {
      dbo = [UploadFileRepository getFileDboFromResultSet:resultSet];
    }
    [resultSet close];
  }];
  [queue close];
  
  return [[UploadFileModel alloc] initWithUploadFileDbo:dbo];
}

-(UploadFileDbo *) getByColumnName:(NSString *) columnName
                 columnValue:(NSString *) columnValue {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       columnName,
                       UploadFileContract.TABLE_NAME,
                       columnName];
  __block UploadFileDbo *dbo = nil;
  FMDatabaseQueue *queue =[self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request, columnValue];
    if(!resultSet) {
      NSLog(@"No result set returned");
      
      return;
    }
    
    if([resultSet next]){
      dbo = [UploadFileRepository getFileDboFromResultSet:resultSet];
    }
    [resultSet close];
  }];
  [queue close];

  return dbo;
}

-(Response *) insertWithModel: (UploadFileModel *) model {
  if(!model || ![model isValid]) {
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeInsertIntoTable:UploadFileContract.TABLE_NAME
                              fromDict: [model toDictionary]];
}

-(Response *) deleteByModel: (UploadFileModel *) model {
  if(!model || ![model isValid]) {
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeDeleteFromTable:UploadFileContract.TABLE_NAME
                         withObjectKey:UploadFileContract.ID
                      withObjecktValue:[NSString stringWithFormat:@"%ld", [model fileHandle]]];
}

-(Response *) deleteById: (NSString *) fileId {
  if(!fileId || [fileId length] == 0){
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeDeleteFromTable:UploadFileContract.TABLE_NAME
                         withObjectKey:UploadFileContract.ID
                      withObjecktValue:fileId];
}

-(Response *) deleteByIds: (NSArray *) fileIds {
  if(!fileIds || [fileIds count] == 0) {
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeDeleteFromTable:UploadFileContract.TABLE_NAME
                         withObjectKey:UploadFileContract.ID
                        withObjecktIds:fileIds];
}

-(Response *) deleteAll {
  
  return [super executeDeleteAllFromTable:UploadFileContract.TABLE_NAME];
}

-(Response *) updateByModel: (UploadFileModel *) model {
  if(!model || ![model isValid]) {
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeUpdateAtTable:UploadFileContract.TABLE_NAME
                           objectKey:UploadFileContract.ID
                            objectId:[NSString stringWithFormat:@"%ld",[model fileHandle]]
                    updateDictionary:[model toDictionary]];
}

+(UploadFileDbo *) getFileDboFromResultSet:(FMResultSet *) resultSet {
  UploadFileDbo * dbo = [[UploadFileDbo alloc]
                         initWithFileHandle:[resultSet longForColumn:UploadFileContract.ID]
                         progress:[resultSet doubleForColumn:UploadFileContract.PROGRESS]
                         size:[resultSet longForColumn:UploadFileContract.SIZE]
                         uploaded:[resultSet longForColumn:UploadFileContract.UPLOADED]
                         name:[resultSet stringForColumn:UploadFileContract.NAME]
                         uri:[resultSet stringForColumn:UploadFileContract.URI]
                         bucketId:[resultSet stringForColumn:UploadFileContract.BUCKET_ID]] ;
  
  return dbo;
}

+(NSArray *)getSelectionColumnsString {
  if(!columns) {
    NSMutableArray *colArray = [NSMutableArray array];
    [colArray addObject:UploadFileContract.ID];
    [colArray addObject:UploadFileContract.NAME];
    [colArray addObject:UploadFileContract.URI];
    [colArray addObject:UploadFileContract.PROGRESS];
    [colArray addObject:UploadFileContract.SIZE];
    [colArray addObject:UploadFileContract.UPLOADED];
    [colArray addObject:UploadFileContract.BUCKET_ID];
    
    columns = [NSArray arrayWithArray:colArray];
  }
  
  return columns;
}

@end


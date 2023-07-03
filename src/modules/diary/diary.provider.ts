import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Diary } from '@app/diary/entities';

export enum DiaryProvider {
  REPOSITORY = 'DIARY_REPOSITORY',
}

export const diaryProvider = [
  {
    provide: DiaryProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Diary),
    inject: [DatabaseProvider.SOURCE],
  },
];

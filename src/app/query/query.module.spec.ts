import { QueryModule } from './query.module';

describe('QueryModule', () => {
  let queryModule: QueryModule;

  beforeEach(() => {
    queryModule = new QueryModule();
  });

  it('should create an instance', () => {
    expect(queryModule).toBeTruthy();
  });
});

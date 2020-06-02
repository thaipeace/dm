import { EdgeModule } from './edge.module';

describe('EdgeModule', () => {
  let edgeModule: EdgeModule;

  beforeEach(() => {
    edgeModule = new EdgeModule();
  });

  it('should create an instance', () => {
    expect(edgeModule).toBeTruthy();
  });
});

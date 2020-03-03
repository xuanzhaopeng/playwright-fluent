import * as SUT from '../index';
import { Page } from 'playwright';

describe('record requests to', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const requests: SUT.Request[] = [];
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const callback = (request: SUT.Request) => requests.push(request);

    // When
    // Then
    const expectedError = new Error(
      "Cannot record requests to '/foobar' because no browser has been launched",
    );
    await SUT.recordRequestsTo('/foobar', page, callback).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});

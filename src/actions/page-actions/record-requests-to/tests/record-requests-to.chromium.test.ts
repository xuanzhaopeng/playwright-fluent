import * as SUT from '../index';
import { Browser, chromium } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';

describe('record requests to', (): void => {
  let browser: Browser | undefined = undefined;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1234);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1234
  });
  afterAll(() => {
    if (fakeServer) {
      fakeServer.stop();
    }
  });
  beforeEach((): void => {
    jest.setTimeout(60000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );

  test('should record successufull requests', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    const responseBody = {
      prop1: 'foobar',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    const requests: SUT.Request[] = [];
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const callback = (request: SUT.Request) => requests.push(request);

    // When
    await SUT.recordRequestsTo('/foobar', page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-requests-to.test.html')}`);
    await page.waitFor(3000);

    // Then
    expect(requests.length).toBe(1);
    expect(requests[0].url()).toContain('?foo=bar');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(requests[0].response()!.status()).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await requests[0].response()!.json()).toMatchObject(responseBody);
  });

  test('should record failed requests 500', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    const requests: SUT.Request[] = [];
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const callback = (request: SUT.Request) => requests.push(request);

    // When
    await SUT.recordRequestsTo('/500', page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`);
    await page.waitFor(3000);

    // Then
    expect(requests.length).toBe(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(requests[0].response()!.status()).toBe(500);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(requests[0].response()!.statusText()).toBe('Internal Server Error');
  });
});

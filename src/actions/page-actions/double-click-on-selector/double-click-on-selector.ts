import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions, defaultWaitUntilOptions } from '../../../utils';
import { doubleClickOnHandle, DoubleClickOptions } from '../../handle-actions';
import { Page } from 'playwright';

export async function doubleClickOnSelector(
  selector: string,
  page: Page | undefined,
  options: DoubleClickOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot double-click on '${selector}' because no browser has been launched`);
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  const handle = await getHandleOf(selector, page, waitOptions);
  await doubleClickOnHandle(handle, selector, page, options);
}

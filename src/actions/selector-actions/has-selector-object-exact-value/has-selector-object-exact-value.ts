import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { hasHandleExactValue } from '../../handle-actions';
import { Page } from 'playwright';

export async function hasSelectorObjectExactValue(
  selector: SelectorFluent,
  expectedValue: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check exact value of '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot check exact value of '${selector.toString()}' because this selector was not found in DOM`,
    options,
  );

  const handle = await selector.getHandle();
  return await hasHandleExactValue(handle, expectedValue);
}

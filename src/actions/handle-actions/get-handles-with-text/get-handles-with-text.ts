import { ElementHandle } from 'playwright';

export async function getHandlesWithText(
  text: string,
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const handle = handles[index];

    const innerText = await handle.evaluate((node) => {
      const nodeWithText = node as HTMLElement;
      if (nodeWithText && nodeWithText.innerText) {
        return nodeWithText.innerText;
      }

      return undefined;
    });
    if (innerText && innerText.includes(text)) {
      result.push(handle);
    }
  }

  return result;
}

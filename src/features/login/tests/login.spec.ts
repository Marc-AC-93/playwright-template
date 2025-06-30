import { TestTags } from '../../../data/TestTags';
import { test } from '../fixture';

test.describe('Login', () => {
  test(
    'User login',
    {
      tag: [TestTags.LOGIN],
    },
    async ({ portal }) => {
      await portal.openPortal();
    }
  );
});

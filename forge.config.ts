import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';

export default {
  packagerConfig: {
    icon: './assets/icons/icon'
  },
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerDeb({})
  ]
};

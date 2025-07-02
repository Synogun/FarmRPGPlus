import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import RouterPlus from './routerPlus';

class DebugPlus {

    isDevelopmentMode = () => {
        return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    };

    goto = (hash) => {
        if (typeof hash !== 'string' || hash.trim() === '') {
            new FarmRPGPlusError(
                ErrorTypesEnum.INVALID_URL,
                this.goto.name,
            );
            return;
        }
    
        if (!RouterPlus.isHashValid(hash)) {
            new FarmRPGPlusError(
                ErrorTypesEnum.INVALID_URL,
                this.goto.name,
            );
            return;
        }

        window.location.replace(`${window.location.origin}/${hash}`);
        window.location.reload();
    };

    applyDebugFeatures = () => {
        window.goto = this.goto;
    };

}

export default new DebugPlus;

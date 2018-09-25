import Recorder from './recorder'
import { defaultLOptions } from '@common/config'

export default class Locker {
    constructor(options) {
        this.options = {...defaultLOptions, ...options}
        super(options);
    }
}
class FrameProvider {
    constructor(tid, stop, frameStatus) {
        this.tid = tid;
        this.stop = stop;
        this.frameCollection = {};
        this.MAX_LOAD = 10;
        this.stack = [];
        this.loadInterval = null;
        this.loadCounter = 0;
        this.frameStatus = frameStatus;

        this.required = null;
        this.loaded = null;

        this.preloadRunned = false;
        this.loadAllowed = true;
    }

    printA() {
        console.log('provider', this.tid);
    }

    frameIsExist(frame) {
        if (frame in this.frameCollection) {
            return true;
        }
        return false;
    }

    require(frame) {
        if (frame in this.frameCollection) {
            this.preload(frame);
            return this.frameCollection[frame];
        }
        this.required = frame;
        this.loadCounter = this.MAX_LOAD;
        this.load();
        return null;
    }

    preload(frame) {
        if (this.preloadRunned) {
            return;
        }

        const last = Math.min(this.stop, frame + this.MAX_LOAD);
        if (!(last in this.frameCollection)) {
            for (let idx = frame + 1; idx <= last; idx += 1) {
                if (!(idx in this.frameCollection)) {
                    this.loadCounter = this.MAX_LOAD - (idx - frame);
                    this.stack.push(idx);
                    this.preloadRunned = true;
                    this.load();
                    return;
                }
            }
        }
    }

    load() {
        if (!this.loadInterval) {
            this.loadInterval = setInterval(() => {
                if (!this.loadAllowed) {
                    return;
                }

                if (this.loadCounter <= 0) {
                    this.stack = [];
                }

                if (!this.stack.length && this.required == null) {
                    clearInterval(this.loadInterval);
                    this.preloadRunned = false;
                    this.loadInterval = null;
                    return;
                }

                if (this.required != null) {
                    this.stack.push(this.required);
                    this.required = null;
                }

                // pass exist
                const frame = this.stack.pop();
                if (frame in this.frameCollection) {
                    this.loadCounter -= 1;
                    const next = frame + 1;
                    if (next <= this.stop && this.loadCounter > 0) {
                        this.stack.push(next);
                    }
                    return;
                }

                if (frame === this.stop) {
                    this.stack = [];
                }

                this.loadAllowed = false;
                const image = new Image();
                image.onload = () => { this.onImageLoad(image, frame); };
                image.onerror = () => {
                    this.loadAllowed = true;
                    image.onload = null;
                    image.onerror = null;
                };
                image.src = `/api/v1/tasks/${this.tid}/get_frame/?id=${this.frameStatus[frame].id}`;
            }, (25));
        }
    }

    onImageLoad(image, frame) {
        const next = frame + 1;
        if (next <= this.stop && this.loadCounter > 0) {
            this.stack.push(next);
        }
        this.loadCounter -= 1;
        this.loaded = frame;
        this.frameCollection[frame] = image;
        this.loadAllowed = true;
        image.onerror = null;
        image.onload = null;
    }
}
export default FrameProvider;

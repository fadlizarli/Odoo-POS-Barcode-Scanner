/** @odoo-module **/
import { onMounted, onWillUnmount } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { ActionpadWidget } from "@point_of_sale/app/screens/product_screen/action_pad/action_pad";


class CameraPopup extends AbstractAwaitablePopup {
    static template = "pos_camera_scanner.CameraPopup";
    static defaultProps = { confirmText: "Ok", cancelText: "Close", title: "Scan" };

    setup() {
        super.setup();
        this.pos = usePos();
        this.quaggaRunning = false;
        this.isProcessing = false;
        onMounted(() => setTimeout(() => this.initQuagga(), 300));
        onWillUnmount(() => this.stopQuagga());
    }

    stopQuagga() {
        if (this.quaggaRunning && window.Quagga) {
            try { window.Quagga.stop(); } catch (e) {}
            this.quaggaRunning = false;
        }
    }

    updateStatus(msg, color) {
        const el = document.getElementById("scanner_status");
        if (el) {
            el.innerText = msg;
            el.style.backgroundColor = color;
        }
    }

    initQuagga() {
        if (!window.Quagga) {
            this.updateStatus("Loading library...", "#ffeb3b");
            setTimeout(() => this.initQuagga(), 500);
            return;
        }
        window.Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector("#interactive"),
                constraints: { facingMode: "environment", width: 640, height: 480, focusMode: "continuous" }
            },
            decoder: { readers: ["ean_reader", "upc_reader", "code_128_reader", "code_39_reader"] },
            locate: true
        }, (err) => {
            if (err) { this.updateStatus("Camera Error: " + err.name, "#f44336"); return; }
            this.updateStatus("Ready. Scan Barcode.", "#e0e0e0");
            window.Quagga.start();
            this.quaggaRunning = true;
            window.Quagga.onDetected(this._onDetected.bind(this));
        });
    }

    async _onDetected(result) {
        if (this.isProcessing) return;
        const code = result.codeResult.code;
        if (!code || code.length < 5) return;
        this.isProcessing = true;
        this.updateStatus("Checking: " + code, "#81c784");
        const video = document.querySelector("#interactive video");
        if (video) video.pause();
        try {
            await this.processBarcode(code);
        } catch (e) {
            this.updateStatus("Error: " + e.message, "#f44336");
            await new Promise(r => setTimeout(r, 2000));
            this.resetScanner();
        }
    }

    async processBarcode(code) {
        code = String(code).trim();
        const attempts = [code, "0" + code, code.replace(/^0+/, "")];
        const uniqueCodes = [...new Set(attempts)];
        let product = null;
        for (const c of uniqueCodes) {
            product = this.pos.db.get_product_by_barcode(c);
            if (product) break;
        }
        if (product) {
            this.updateStatus("FOUND: " + product.display_name, "#4caf50");
            this.pos.get_order().add_product(product);
            await new Promise(r => setTimeout(r, 1000));
            this.confirm(code);
        } else {
            this.updateStatus("NOT FOUND: " + code, "#f44336");
            await new Promise(r => setTimeout(r, 2000));
            this.resetScanner();
        }
    }

    resetScanner() {
        this.isProcessing = false;
        this.updateStatus("Ready. Scan next.", "#e0e0e0");
        const video = document.querySelector("#interactive video");
        if (video) video.play();
    }
}

patch(ProductScreen.prototype, {
    async onClickCameraScan() {
        await this.env.services.popup.add(CameraPopup);
    }
});

patch(ActionpadWidget.prototype, {
    async onClickCameraScan() {
        await this.env.services.popup.add(CameraPopup);
    }
});

export { CameraPopup };

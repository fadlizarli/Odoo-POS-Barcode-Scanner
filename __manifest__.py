{
    'name': 'POS Custom Camera Scanner',
    'version': '2.0',
    'category': 'Point of Sale',
    'summary': 'High Precision Barcode Scanner (Quagga2)',
    'depends': ['point_of_sale'],
    'data': [],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_camera_scanner/static/lib/quagga.min.js',
            'pos_camera_scanner/static/src/xml/camera_button.xml',
            'pos_camera_scanner/static/src/js/camera_button.js',
        ],
    },
    'installable': True,
}
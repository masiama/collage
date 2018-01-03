const collage = (el, options) => {
	const defaults = {
		targetHeight: 400,
		display: 'inline-block',
		partialLast: false
	};
	
	let row = 0;
	let elements = [];
	let rownum = 1;
	
	defaults.contWidth = parseFloat(window.getComputedStyle(el).width);
	defaults.padding = parseFloat(window.getComputedStyle(el).paddingLeft);
	defaults.images = el.children;
	
	const settings = Object.assign({}, defaults, options);
	
	const getImgProperty = img => ({
		w: parseFloat(window.getComputedStyle(img).borderLeftWidth) + parseFloat(window.getComputedStyle(img).borderRightWidth),
		h: parseFloat(window.getComputedStyle(img).borderTopWidth) + parseFloat(window.getComputedStyle(img).borderBottomWidth)
	});
	
	const resizeRow = (obj, row) => {
		const imageExtras = (settings.padding * (obj.length - 1)) + (obj.length * obj[0][3]);
		const overPercent = (settings.contWidth - imageExtras) / (row - imageExtras);
		const lastRow = row < settings.contWidth;
		let trackWidth = imageExtras;
		
		for (var i = 0; i < obj.length; i++) {
			const block = obj[i][0];
			let fw = Math.floor(obj[i][1] * overPercent);
			let fh = Math.floor(obj[i][2] * overPercent);
			const isNotLast = i < obj.length - 1;
			
			if (settings.partialLast && lastRow) {
				fw = obj[i][1];
				fh = obj[i][2];
			}
			
			trackWidth += fw;
			
			if (!isNotLast && trackWidth < settings.contWidth && (!settings.partialLast || !lastRow)) {
				fw += settings.contWidth - trackWidth;
			}
			
			fw--;
			
			const img = block.tagName == 'IMG' ? block : block.getElementsByTagName('img')[0];
			
			img.style.width = fw + 'px';
			if (block.tagName != 'IMG') block.style.width = (fw + obj[i][3]) + 'px';
			
			img.style.height = fh + 'px';
			if (block.tagName != 'IMG') block.style.height = (fh + obj[i][4]) + 'px';
			
			Object.assign(block.style, {
				marginBottom: settings.padding + 'px',
				marginRight: isNotLast ? settings.padding + 'px' : 0,
				display: settings.display,
				verticalAlign: 'bottom',
				overflow: 'hidden',
				opacity: 1
			});
		}
	}
	
	Array.from(settings.images).map((block, i) => {
		const img = block.tagName == 'IMG' ? block : block.getElementsByTagName('img')[0];
		const w = parseFloat(img.dataset.width ||  window.getComputedStyle(img).width);
		const h = parseFloat(img.dataset.height ||  window.getComputedStyle(img).height);
		const params = getImgProperty(img);
		
		img.setAttribute('width', w);
		img.setAttribute('height', h);
		
		const nw = Math.ceil(w / h * settings.targetHeight);
		const nh = Math.ceil(settings.targetHeight);
		
		elements.push([img, nw, nh, params.w, params.h]);
		
		row += nw + params.w + settings.padding;
		
		if (row > settings.contWidth && elements.length != 0) {
			resizeRow(elements, row - settings.padding);
			row = 0;
			elements = [];
			rownum += 1;
		}
		
		if (settings.images.length - 1 == i && elements.length != 0) {
			resizeRow(elements, row);
			row = 0;
			elements = [];
			rownum += 1;
		}
	})
}
document.addEventListener('DOMContentLoaded', function () {
	const checkboxes = document.querySelectorAll('.checker-sum');
	const totalSizeElement = document.getElementById('total-size');
	const cleanupButton = document.querySelector('.cleanup-button');
	const noItemsClass = 'no-items';

	function updateTotalSize() {
		let totalSize = 0;
		let itemsSelected = false;

		checkboxes.forEach(checkbox => {
			if (checkbox.checked) {
				const parent = checkbox.closest('.file-category');
				const size = parseInt(parent.dataset.size);
				totalSize += size;
				itemsSelected = true;
			}
			syncCheckboxes(checkbox);
		});

		cleanupButton.textContent = `Clean Up ${totalSize} MB`;

		if (itemsSelected) {
			cleanupButton.classList.remove(noItemsClass);
		} else {
			cleanupButton.classList.add(noItemsClass);
		}
	}

	checkboxes.forEach(checkbox => {
		const parent = checkbox.closest('.file-category');
		const size = parseInt(parent.dataset.size);

		if (size === 0) {
			checkbox.disabled = true;
		}
	});

	updateTotalSize();

	checkboxes.forEach(checkbox => {
		checkbox.addEventListener('change', function () {
			syncCheckboxes(checkbox);
			updateTotalSize();
		});
	});

	function cleanUp() {
		let totalSizeToClean = 0;

		checkboxes.forEach(checkbox => {
			const parent = checkbox.closest('.file-category');
			const sizeElement = parent.querySelector('.size');
			const size = parseInt(parent.dataset.size);

			if (checkbox.checked) {
				totalSizeToClean += size;
				const detailsPanel = parent.querySelector('.details-panel');
				const toggleIcon = parent.querySelector('.toggle');
				if (detailsPanel) {
					detailsPanel.remove();
					toggleIcon.textContent = 'arrow_drop_down';
				}
				parent.dataset.size = 0;
				sizeElement.textContent = '0 B';
				checkbox.checked = false;
				checkbox.disabled = true;
			}
		});

		const currentTotalSize = parseInt(totalSizeElement.textContent);
		const newTotalSize = currentTotalSize - totalSizeToClean;
		totalSizeElement.innerHTML = `${newTotalSize} <span class="size-unit">MB</span>`;
		cleanupButton.textContent = `Clean Up 0 MB`;

		updateTotalSize();
	}

	cleanupButton.addEventListener('click', cleanUp);

	function syncCheckboxes(parentCheckbox) {
		const parent = parentCheckbox.closest('.file-category');
		const appCheckboxes = parent.querySelectorAll('.app-checker');

		appCheckboxes.forEach(appCheckbox => {
			appCheckbox.checked = parentCheckbox.checked;
		});
	}

	function syncParentCheckbox(appCheckbox) {
		const parent = appCheckbox.closest('.file-category');
		const parentCheckbox = parent.querySelector('.checker');
		const allChecked = Array.from(parent.querySelectorAll('.app-checker')).every(cb => cb.checked);

		parentCheckbox.checked = allChecked;
	}

	document.querySelectorAll('.app-checker').forEach(appCheckbox => {
		appCheckbox.addEventListener('change', function () {
			syncParentCheckbox(appCheckbox);
			updateTotalSize();
		});
	});

	function togglePanel(event) {
		const parent = event.target.closest('.file-category');
		const detailsPanel = parent.querySelector('.details-panel');
		const toggleIcon = parent.querySelector('.toggle');

		if (detailsPanel && detailsPanel.style.display === 'block') {
			detailsPanel.style.display = 'none';
			toggleIcon.textContent = 'arrow_drop_down';
		} else if (detailsPanel) {
			detailsPanel.style.display = 'block';
			toggleIcon.textContent = 'arrow_drop_up';
		}
	}

	const toggles = document.querySelectorAll('.file-category .toggle');
	toggles.forEach(toggle => {
		const parent = toggle.closest('.file-category');
		const detailsPanel = parent.querySelector('.details-panel');
		const toggleIcon = parent.querySelector('.toggle');

		if (detailsPanel) {
			detailsPanel.style.display = 'none';
		}
		if (toggleIcon) {
			toggleIcon.textContent = 'arrow_drop_down';
		}

		toggle.addEventListener('click', togglePanel);
	});

	document.querySelectorAll('.file-category').forEach(category => {
		const detailsPanel = category.querySelector('.details-panel');
		const toggleIcon = category.querySelector('.toggle');

		if (detailsPanel) {
			detailsPanel.style.display = 'none';
		}

		if (toggleIcon) {
			toggleIcon.textContent = 'arrow_drop_down';
		}
	});

});
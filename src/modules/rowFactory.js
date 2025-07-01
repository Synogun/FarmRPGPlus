import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import { createRow, isUrlValid } from '../utils/utils';

/**
 * RowFactory class for creating jQuery <li> elements representing rows with optional media, title, subtitle, button, and link.
 */
class RowFactory {
    constructor() {
        this.reset();
    }

    reset() {
        this.options = {
            rowId: undefined,
            rowClass: undefined,
            rowTargetUrl: undefined,
            rowIconSourceUrl: undefined,
            rowIconTargetUrl: undefined,
            
            title: [],
            subtitle: [],
            titleIcons: [],

            rowEnd: [],
        };
        return this;
    }

    addTitleText({ title, bold = false }) {
        if (!title && title !== '') {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.addTitleText.name,
            );
        }

        this.options.title.push({ title, bold });
        return this;
    }

    addSubtitle({ subtitle, bold = false, newLine = true }) {
        if (!subtitle && subtitle !== '') {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.addSubtitle.name,
            );
        }

        this.options.subtitle.push({ subtitle, bold, newLine });
        return this;
    }

    addTitleIcon({ iconUrl, iconName }) {
        if (iconUrl?.trim() === '' && iconName?.trim() === '') {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.addTitleIcon.name,
            );
        }

        this.options.title.push({ iconUrl, iconName });
        return this;
    }

    addRowIcon({ sourceUrl, targetUrl = undefined }) {
        if (sourceUrl?.trim() === '') {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.addRowIcon.name,
            );
        }

        this.options.rowIconSourceUrl = sourceUrl;
        this.options.rowIconTargetUrl = targetUrl;
        return this;
    }

    setRowId(id) {
        if (id?.trim() === '') {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.setRowId.name,
            );
        }

        this.options.rowId = id;
        return this;
    }

    setRowClass(cls) {
        if (cls?.trim() === '' || cls?.length === 0) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.setRowClass.name,
            );
        }

        if (this.options.rowClass === undefined) {
            this.options.rowClass = '';
        }

        if (!Array.isArray(cls)) {
            cls = cls.split(' ');
        }

        cls = cls.map(c => c.trim()).filter(c => c);
        this.options.rowClass += ` ${cls.join(' ')}`;

        return this;
    }

    setRowTarget(url) {
        if (url?.trim() === '') {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.setRowTarget.name,
            );
        }

        if (!isUrlValid(url)) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.INVALID_URL,
                this.setRowTarget.name,
            );
        }

        this.options.rowTargetUrl = url;
        return this;
    }

    // --- Internal helper ---
    createMediaContent() {
        const { iconSourceUrl, iconTargetUrl } = this.options;
        let $mediaContent;

        if (iconSourceUrl?.trim()) {
            $mediaContent = $(`<img class="itemimg" src="${iconSourceUrl}">`);
        } else if (iconSourceUrl === '') {
            $mediaContent = $('<div class="itemimg">');
        }

        if (iconTargetUrl?.trim()) {
            return $('<div class="item-media">').append(
                $('<a>')
                    .attr('href', iconTargetUrl)
                    .append($mediaContent),
            );
        }

        return $mediaContent ? $('<div class="item-media">').append($mediaContent) : null;
    }

    createItemTitle() {
        const { title = '', subtitle = '', iconUrl, iconClass, iconOnTitleEnd = false } = this.options;
        const $itemTitle = $('<div class="item-title">');
        if (iconUrl || iconClass) {
            $itemTitle.append(
                iconOnTitleEnd ? `${title} ` : ` ${title}`,
            );
            if (iconClass) {
                iconOnTitleEnd
                    ? $itemTitle.append($('<i>').addClass(iconClass))
                    : $itemTitle.prepend($('<i>').addClass(iconClass));
            } else if (iconUrl) {
                const $image = $('<img>')
                    .attr('src', iconUrl)
                    .css('width', '16px')
                    .css('height', '16px');
                iconOnTitleEnd
                    ? $itemTitle.append($image)
                    : $itemTitle.prepend($image);
            }
        } else {
            $itemTitle.append(title);
        }
        if (subtitle) {
            $itemTitle.append(['<br>', `<span style="font-size: 11px">${subtitle}</span>`]);
        }
        return $itemTitle;
    }

    createItemAfter() {
        const { buttonLabel, onClick, afterLabel, iconImageUrl } = this.options;
        let $itemAfter = null;
        if (buttonLabel && onClick) {
            const $btn = $(`<button class="button btngreen">${buttonLabel}</button>`)
                .on('click', onClick || (() => { }));
            $itemAfter = $('<div class="item-after">').append($btn);
        } else if (afterLabel && !buttonLabel) {
            $itemAfter = $('<div class="item-after">').append(afterLabel);
        } else if (!afterLabel && !iconImageUrl) {
            $itemAfter = $('<div class="item-after">');
        }
        return $itemAfter;
    }

    wrapWithLink($itemContent) {
        const { rowLink, rowId, rowClass } = this.options;
        if (!rowLink) return null;
        const isExternal = !rowLink.includes('.php');
        let $a = $('<a>')
            .addClass('item-link')
            .addClass('close-panel')
            .attr('href', rowLink)
            .attr('data-view', '.view-main');
        if (rowId) $a.attr('id', rowId);
        if (rowClass) $a.addClass(rowClass);
        if (isExternal) {
            $a
                .addClass('external')
                .attr('target', '_blank')
                .attr('rel', 'noopener noreferrer');
        }
        return $a.append($itemContent);
    }

    create() {
        const { rowId, rowClass, rowLink } = this.options;
        const $itemMedia = this.createMediaContent();
        const $itemTitle = this.createItemTitle();
        const $itemAfter = this.createItemAfter();
        const $itemInner = $('<div class="item-inner">').append($itemTitle, $itemAfter);
        const $itemContent = $('<div class="item-content">').append($itemMedia, $itemInner);
        let $li = $('<li>');
        if (rowLink) {
            const $a = this.wrapWithLink($itemContent);
            $li.append($a);
        } else {
            $li.addClass('close-panel');
            if (rowClass) $li.addClass(rowClass);
            if (rowId) $li.attr('id', rowId);
            $li.append($itemContent);
        }
        return $li;
    }
}

// Usage: const row = new RowFactory().addTitle('Title').addRowIcon('url').create();

export default RowFactory;

export {
    createRow
};


import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';

/**
 * Creates a jQuery <li> element representing a row with optional media, title, subtitle, button, and link.
 *
 * @param {Object} [options={}] - Configuration options for the row.
 * @param {string} [options.rowId=''] - The id attribute for the row element.
 * @param {string} [options.rowClass=''] - Additional CSS classes for the row element.
 * @param {string} [options.rowLink=''] - If provided, wraps the row in an anchor linking to this URL.
 * @param {string} [options.buttonLabel=''] - Label for an optional button displayed in the row.
 * @param {function} [options.onClick] - Click handler for the button, if present.
 * @param {string} [options.iconImageUrl=''] - URL for an image to display as the row's icon.
 * @param {string} [options.iconMediaUrl=''] - If provided, wraps the icon image in a link to this URL.
 * @param {string} [options.iconClass=''] - Additional CSS classes for the icon image.
 * @param {string} [options.title=''] - Main title text for the row.
 * @param {string} [options.subtitle=''] - Subtitle text displayed below the title.
 * @param {string} [options.afterLabel=''] - Text or HTML to display after the title, if no button is present.
 * @returns {jQuery} The constructed <li> element as a jQuery object.
 */
function createRow({
    rowId = '',
    rowClass = '',
    rowLink = '',
    
    buttonLabel = '',
    onClick,
    
    iconImageUrl,
    iconMediaUrl = '',
    iconClass = '',
    iconUrl = '',
    iconOnTitleEnd = false,
    
    title = '',
    subtitle = '',
    
    afterLabel = '',
    
} = {}) {
    
    let $mediaContent;
    
    if (iconImageUrl?.trim()) {
        $mediaContent = $(`<img class="itemimg" src="${iconImageUrl}">`);
    } else if (iconImageUrl === '') {
        $mediaContent = $('<div class="itemimg">');
    }

    let $itemMedia;
    
    if (iconMediaUrl) {
        $itemMedia = $('<div class="item-media">').append(
            $('<a>')
                .attr('href', iconMediaUrl)
                .append($mediaContent),
        );
    } else {
        $itemMedia = $('<div class="item-media">').append($mediaContent);
    }

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

    // $itemTitle.append(
    //     `${iconClass || iconUrl ? ' ': ''}${title}`,
        
    // );

    let $itemAfter = null;
    
    if (buttonLabel && onClick) {
        const $btn = $(`<button class="button btngreen">${buttonLabel}</button>`)
            .on('click', onClick || (() => { }));
        $itemAfter = $('<div class="item-after">').append($btn);
    }

    if (afterLabel && !buttonLabel) {
        $itemAfter = $('<div class="item-after">').append(afterLabel);
    }

    if (!afterLabel && !iconImageUrl) {
        $itemAfter = $('<div class="item-after">');
    }

    const $itemInner = $('<div class="item-inner">').append(
        $itemTitle,
        $itemAfter,
    );

    const $itemContent = $('<div class="item-content">').append(
        $itemMedia,
        $itemInner,
    );

    let $li = $('<li>');

    if (rowLink) {
        const isExternal = !rowLink.includes('.php');

        let $a = $('<a>')
            .addClass('item-link')
            .addClass('close-panel')
            .attr('href', rowLink)
            .attr('data-view', '.view-main');
        
        if (rowId) {
            $a.attr('id', rowId);
        }

        if (rowClass) {
            $a.addClass(rowClass);
        }

        if (isExternal) {
            $a
                .addClass('external')
                .attr('target', '_blank')
                .attr('rel', 'noopener noreferrer');
        }
        
        $li = $('<li>').append($a.append($itemContent));

    } else {
        $li = $('<li>').addClass('close-panel');

        if (rowClass) {
            $li.addClass(rowClass);
        }

        if (rowId) {
            $li.attr('id', rowId);
        }

        $li.append($itemContent);
    }

    return $li;
}

/**
 * Creates a list of card elements with an optional title and child elements.
 *
 * @param {Object} params - The parameters for creating the card list.
 * @param {string} [params.cardClass=''] - Additional CSS class to apply to the card.
 * @param {string} [params.title=''] - Optional title to display above the card list.
 * @param {Array} [params.children=[]] - Array of child elements (typically jQuery elements) to include in the list.
 * @returns {Array} An array of jQuery elements representing the card list, optionally including a title.
 */
function createCardList({ cardId = '', cardClass = '', title = '', children = [] }) {
    if (typeof cardClass !== 'string' || !Array.isArray(children)) {
        new FarmRPGPlusError(
            ErrorTypesEnum.PARAMETER_MISMATCH,
            createCardList.name
        );
    }

    const content = [];
    
    content.push(
        $('<div>')
            .addClass('card')
            .addClass(cardClass || '')
            .attr('id', cardId || '')
            .append(
                $('<div>')
                    .addClass('card-content')
                    .append(
                        $('<div>')
                            .addClass('list-block')
                            .append(
                                $('<ul>').append(children),
                            ),
                    ),
            ),
    );


    if (title) {
        content.unshift(
            $('<div>')
                .addClass('content-block-title')
                .text(title)
        );
    }

    return content;
}

/**
 * Retrieves a list element associated with a given title from a page container.
 *
 * @param {Object} page - The page object containing the container to search within.
 * @param {string} title - The title to search for. Can be matched exactly or via regex.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.returnTitle=false] - If true, returns the matching title element instead of the list.
 * @param {boolean} [options.regex=false] - If true, uses a regular expression to match the title.
 * @param {number} [options.offset=0] - Offset from the found title. Can be negative to search backwards.
 * @returns {jQuery} The jQuery object representing the found list or title element.
 * @throws {FarmRPGPlusError} Throws if parameters are invalid or elements are not found.
 */
function getListByTitle(page, title, { returnTitle = false, regex = false, offset = 0 } = {}) {
    if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof offset !== 'number' ||
        !page ||
        !page.container
    ) {
        new FarmRPGPlusError(
            ErrorTypesEnum.PARAMETER_MISMATCH,
            getListByTitle.name
        );
    }

    let $listOfTitles = $(page.container).find('div.content-block-title');

    let $matchingTitle = $listOfTitles.filter((_, el) => {
        const text = $(el).text().trim();
        return regex
            ? text.match(new RegExp(title.trim(), 'i'))
            : text === title.trim();
    });

    if ($matchingTitle.length === 0 && offset !== 0) {
        if (offset < 0) {
            $listOfTitles = $listOfTitles.get().reverse();
            offset = -offset;
        }

        const idx = ($listOfTitles.index($matchingTitle[0]) + offset) % $listOfTitles.length;
        $matchingTitle = $listOfTitles.eq(idx);
    }

    if ($matchingTitle.length === 0) {
        new FarmRPGPlusError(
            ErrorTypesEnum.ELEMENT_NOT_FOUND,
            getListByTitle.name,
        );
    }

    if (returnTitle) {
        return $matchingTitle;
    }

    const $card = $matchingTitle.next('.card');

    if ($card.length === 0) {
        new FarmRPGPlusError(
            ErrorTypesEnum.ELEMENT_NOT_FOUND,
            getListByTitle.name,
        );
    }
    
    let $list = $card.find('.list-block ul');

    if ($list.length) {
        return $list.eq(0);
    }

    if ($card.next('.list-block')) {
        $list = $card.next('.list-block').find('ul').eq(0);
    }

    if ($list.length === 0) {
        new FarmRPGPlusError(
            ErrorTypesEnum.ELEMENT_NOT_FOUND,
            getListByTitle.name,
        );
    }

    return $list;
}

/**
 * Checks if the given string is a valid URL.
 *
 * @param {string} url - The URL string to validate.
 * @returns {boolean} Returns true if the URL is valid, otherwise false.
 */
function isUrlValid(url) {
    try {
        // eslint-disable-next-line no-undef
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Determines if the current time (in Central Time, UTC-5) falls within specific reset periods.
 *
 * The function checks two reset windows:
 * 1. Between 11:30 and 11:35 PM CT (inclusive).
 * 2. Between 12:00 and 12:04 AM CT (inclusive).
 *
 * @returns {boolean} Returns true if the current time is within a reset period, otherwise false.
 */
function isResetTime() {
    const nowOnCT = new Date((new Date).getTime() + ((new Date).getTimezoneOffset() * 60000) + (3600000 * -5));

    if (
        nowOnCT.getHours() === 23 &&
        nowOnCT.getMinutes() >= 30 &&
        nowOnCT.getMinutes() <= 35) {
        return true;
    }

    if (
        nowOnCT.getHours() === 0 &&
        nowOnCT.getMinutes() >= 0 &&
        nowOnCT.getMinutes() < 5
    ) {
        return true;
    }

    return false;
}

/**
 * Converts a name into a URL-friendly string by:
 * - Trimming whitespace
 * - Replacing spaces and special characters with hyphens
 * - Replacing accented characters with hyphens
 * - Collapsing multiple hyphens into a single hyphen
 * - Converting the result to lowercase
 *
 * @param {string} name - The original name to be converted.
 * @returns {string} The URL-friendly version of the name.
 */
function parseNameForUrl(name) {
    return name
        .trim()
        .replace(/[ _!@#$%^&*()+=[\]{};':"\\|,.<>/?]+/g, '-') // Replace spaces and special characters with hyphens
        .replace(/[\u00C0-\u00FF]/g, '-') // Replace accented characters with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
        .toLowerCase();
}

export {
    createCardList,
    createRow,
    getListByTitle,
    isResetTime,
    isUrlValid,
    parseNameForUrl
};


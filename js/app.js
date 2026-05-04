import { initNavigation } from './modules/navigation.js';
import { initCarousels } from './modules/carousels.js';
import { initAccessibility } from './modules/accessibility.js';
import { initBible } from './modules/bible.js';
import { initDevotionals } from './modules/devotionals.js';
import { initContactForm } from './modules/contact.js';

document.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
    initNavigation();
    initCarousels();
    initBible();
    initDevotionals();
    initContactForm();
});

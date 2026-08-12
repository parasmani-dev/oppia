// Copyright 2026 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Translation coordinator role utility file for Playwright.
 */

import {Page, expect} from '@playwright/test';
import {LoggedInUser} from './logged-in-user';
import testConstants from '../common/test-constants';

const ContributorDashboardAdminUrl =
  testConstants.URLs.ContributorDashboardAdmin;

const activeTabInContributorAdminPageSelector = '.dashboard-tabs-active';
const addContributorButtonSelector = '.e2e-test-add-contributor-button';
const commonModalTitleSelector = '.e2e-test-modal-header';
const commonModalContainerSelector = '.e2e-test-modal-container';
const addRightsButtonSelector = '.e2e-test-add-rights-button';
const contributorCountSelector = '.e2e-test-contributor-count';
const lastDatePickerInputSelector = '.e2e-test-last-date-picker-input';
const mobileLastDatePickerInputSelector =
  '.e2e-test-mobile-last-date-picker-input';
const statsListItemSelector = '.e2e-test-stats-list-item';
const tabSelectionDropdownMobileSelector = '.e2e-test-tab-selection-dropdown';
const newContributorAdminDashboardPageSelector =
  '.e2e-test-new-contributor-admin-dashboard-page';
const oldContributorAdminDashboardPageSelector =
  '.oppia-contributor-dashboard-admin-page-tabs-container';

const languageSelectorModalSelector = '.e2e-test-language-selector-modal-body';
const addLanguageButtonSelector = '.e2e-test-language-selector-add-button';
const selectedLanguageContainerSelector =
  '.e2e-test-selected-language-container';
const selectedLanguageSelector = '.e2e-test-selected-language';
const closeButtonSelector = '.e2e-test-close-button';

const languageSelectorInAdminPageSelector = '.e2e-test-language-selector';
const languageOptionInAdminPageSelector = '.e2e-test-language-selector-option';
const languageSelectorSelectedInAdminPageSelector =
  '.e2e-test-language-selector-selected';

export class TranslationCoordinator extends LoggedInUser {
  /**
   * Function for navigating to the contributor dashboard admin page.
   */
  async navigateToContributorAdminDashboardPage(): Promise<void> {
    await this.goto(ContributorDashboardAdminUrl);
    await this.waitForPageToFullyLoad();
  }

  /**
   * Switches to the tab in the contributor dashboard admin page.
   */
  async switchToTabInContributorAdminPage(
    tabName:
      | 'Translation Submitters'
      | 'Translation Reviewers'
      | 'Question Submitters'
      | 'Question Reviewers'
  ): Promise<void> {
    if (this.isViewportAtMobileWidth()) {
      const modifiedName = tabName.replace(/s$/, '');
      await this.expectElementToBeVisible(tabSelectionDropdownMobileSelector);
      await this.select(
        tabSelectionDropdownMobileSelector,
        modifiedName
      );
    } else {
      const tabNameInLowerCase = tabName.toLocaleLowerCase().replace(/ /g, '-');
      const tabSelector = `.e2e-test-${tabNameInLowerCase}-tab`;
      await this.expectElementToBeVisible(tabSelector);
      await this.clickOnElementWithSelector(tabSelector);
    }
  }

  /**
   * Clicks on the add contributor button.
   */
  async clickOnAddReviewerOrSubmitterButton(): Promise<void> {
    await this.expectElementToBeVisible(addContributorButtonSelector);
    await this.clickOnElementWithSelector(addContributorButtonSelector);
    await this.expectElementToBeVisible(commonModalTitleSelector);
  }

  /**
   * Adds a username in the username input modal and clicks on the add rights button.
   */
  async addUsernameInUsernameInputModal(username: string): Promise<void> {
    await this.expectElementToBeVisible(commonModalContainerSelector);
    const usernameInputSelector = `${commonModalContainerSelector} input`;
    await this.typeInInputField(usernameInputSelector, username);
    await this.clickOnElementWithSelector(addRightsButtonSelector);
  }

  /**
   * Adds a language to the language selector modal.
   */
  async addLanguageInLanguageSelectorModal(
    languageCode: string,
    language: string
  ): Promise<void> {
    await this.expectElementToBeVisible(languageSelectorModalSelector);
    await this.select(`${languageSelectorModalSelector} select`, languageCode);
    await this.expectElementToBeVisible(addLanguageButtonSelector);
    await this.clickOnElementWithSelector(addLanguageButtonSelector);
  }

  /**
   * Closes the language selector modal.
   */
  async closeLanguageSelectorModal(): Promise<void> {
    await this.expectElementToBeVisible(closeButtonSelector);
    await this.clickOnElementWithSelector(closeButtonSelector);
  }

  /**
   * Selects a language in the contributor admin page.
   */
  async selectLanguageInAdminPage(language: string): Promise<void> {
    await this.expectElementToBeVisible(languageSelectorInAdminPageSelector);
    await this.clickOnElementWithSelector(languageSelectorInAdminPageSelector);
    await this.clickOnElementWithText(language);
  }

  /**
   * Removes a language from the language selector modal.
   */
  async removeLanguageFromLanguageSelectorModal(
    language: string
  ): Promise<void> {
    await this.expectElementToBeVisible(selectedLanguageContainerSelector);
    const container = this.page.locator(selectedLanguageContainerSelector, {
      hasText: language,
    });
    await container.locator('button').click();
  }

  /**
   * Checks if the number of contributors is as expected.
   */
  async expectNumberOfContributorsToBe(number: number): Promise<void> {
    await this.expectTextContentToBe(
      contributorCountSelector,
      number.toString()
    );
  }

  /**
   * Sets the "last activity" date filter to yesterday.
   */
  async setLastActivityDateFilterToYesterday(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const day = String(yesterday.getDate()).padStart(2, '0');
    const month = yesterday.toLocaleString('en-US', {month: 'short'});
    const year = String(yesterday.getFullYear());
    const yesterdayDate = `${day}-${month}-${year}`;
    const dateInputSelector = this.isViewportAtMobileWidth()
      ? mobileLastDatePickerInputSelector
      : lastDatePickerInputSelector;

    await this.clearAllTextFrom(dateInputSelector);
    await this.typeInInputField(dateInputSelector, yesterdayDate);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Checks if the number of contributor stats rows in the table is as expected.
   */
  async expectNumberOfStatsRowsToBe(number: number): Promise<void> {
    await expect(this.page.locator(statsListItemSelector)).toHaveCount(number);
  }
}

export let TranslationCoordinatorFactory = (page: Page): TranslationCoordinator =>
  new TranslationCoordinator(page);

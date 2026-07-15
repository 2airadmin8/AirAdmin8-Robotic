/* ============================================================
 * AirAdmin8 Robotics / Contact Form
 * ------------------------------------------------------------
 * WADAX上の問い合わせAPIへ送信し、送信状態と計測イベントを
 * 管理します。画面表示と通信処理をこのファイルへ集約します。
 * ============================================================ */

(() => {
  'use strict';

  const form = document.querySelector('form[data-live-form]');
  if (!form) return;

  const submitButton = form.querySelector('[type="submit"]');
  const statusElement = form.querySelector('[data-form-status]');
  const defaultButtonLabel = submitButton?.textContent || '相談内容を送信する';

  /**
   * フォーム下部の状態メッセージを更新します。
   *
   * @param {string} message 表示する文言
   * @param {'idle'|'success'|'error'} state 表示状態
   */
  function setStatus(message, state = 'idle') {
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.dataset.state = state;
    statusElement.setAttribute(state === 'error' ? 'role' : 'aria-live', state === 'error' ? 'alert' : 'polite');
  }

  /**
   * 送信中のボタン状態を切り替えます。
   *
   * @param {boolean} isSubmitting 送信中かどうか
   */
  function setSubmitting(isSubmitting) {
    if (!submitButton) return;

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? '送信しています…' : defaultButtonLabel;
  }

  /**
   * GA4・GTMへ問い合わせイベントを送信します。
   *
   * @param {string} eventName イベント名
   * @param {Record<string, unknown>} parameters 追加情報
   */
  function track(eventName, parameters = {}) {
    window.AirAdmin8Analytics?.trackEvent(eventName, {
      form_name: 'robotics_contact',
      ...parameters
    });
  }

  /**
   * APIレスポンスをJSONとして検証します。
   * PHPが未配備の場合はHTMLが返るため、利用者向けの説明へ変換します。
   *
   * @param {Response} response Fetch APIのレスポンス
   * @returns {Promise<Record<string, unknown>>}
   */
  async function parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      throw new Error(
        '問い合わせ送信機能がサーバーに反映されていません。お急ぎの場合はメールでご連絡ください。'
      );
    }

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || '送信に失敗しました。入力内容をご確認ください。');
    }

    return result;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    setSubmitting(true);
    setStatus('');
    track('generate_lead_start');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      await parseResponse(response);

      form.reset();
      setStatus('お問い合わせを受け付けました。確認メールをお送りします。', 'success');
      track('generate_lead', { value: 1, currency: 'JPY' });
    } catch (error) {
      console.error('[AirAdmin8 Contact]', error);
      setStatus(
        error instanceof Error
          ? error.message
          : '送信できませんでした。時間をおいて再度お試しください。',
        'error'
      );
      track('generate_lead_error');
    } finally {
      setSubmitting(false);
    }
  });
})();
/**
 * System DOM Refiner v1.0.0
 * Handles advanced layout enhancements for HubSpot system modules.
 */

document.addEventListener('DOMContentLoaded', () => {
    refineSubscriptionPreferences();
    refineSubscriptionConfirmation();
    refineMembershipForms();
    refinePasswordPrompt();
    setupShadowSync();
});

/**
 * Shadow-Sync: Connects custom high-fidelity UI with hidden HubSpot native forms.
 * We use a robust sync helper to ensure both 'input' and 'change' events are fired.
 */
function setupShadowSync() {
    // --- Global UI Features (Must run on all pages) ---
    
    // Password Visibility Toggles
    document.querySelectorAll('.password-toggle, #password-toggle').forEach(toggle => {
        // Remove existing listener if any (to avoid duplicates if called multiple times)
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        newToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = newToggle.getAttribute('data-target') || 'custom-login-password';
            const input = document.getElementById(targetId);
            if (input) {
                const isPass = input.type === 'password';
                input.type = isPass ? 'text' : 'password';
                const icon = newToggle.querySelector('span');
                if (icon) icon.textContent = isPass ? 'visibility_off' : 'visibility';
            }
        });
    });

    const customLoginUI = document.getElementById('custom-login-ui');
    const customRegisterUI = document.getElementById('custom-register-ui');
    const customResetRequestUI = document.getElementById('custom-reset-request-ui');
    const customResetActualUI = document.getElementById('custom-reset-actual-ui');
    const customPromptUI = document.getElementById('custom-prompt-ui');
    const nativeContainer = document.querySelector('.hs-native-forms-hidden') || document.getElementById('sync-test-panel');

    // If no custom UI or native form container, we can't do sync
    if (!(customLoginUI || customRegisterUI || customResetRequestUI || customResetActualUI || customPromptUI) || !nativeContainer) return;

    // --- Sync Logic Helper ---
    const setupFormSync = (formContainer, customMapping, nativeFormSelector) => {
        const nativeForm = nativeContainer.querySelector(nativeFormSelector);
        if (!nativeForm) return;

        Object.keys(customMapping).forEach(customId => {
            const customEl = document.getElementById(customId);
            const nativeSelector = customMapping[customId];
            const nativeEl = nativeForm.querySelector(nativeSelector);
            syncField(customEl, nativeEl);
        });

        // Submit sync
        const customSubmit = formContainer.querySelector('button[id$="-submit"]');
        const nativeSubmit = nativeForm.querySelector('input[type="submit"], button[type="submit"]');
        if (customSubmit && nativeSubmit) {
            customSubmit.addEventListener('click', (e) => { e.preventDefault(); nativeSubmit.click(); });
        }

        // Error Mirroring
        const mirrorErrors = () => {
            const nativeErrors = nativeForm.querySelectorAll('.hs-error-msg, .hs-main-font-element.error, .hs-input.error');
            formContainer.querySelectorAll('.custom-error-msg').forEach(el => el.remove());

            nativeErrors.forEach(err => {
                const msg = document.createElement('p');
                msg.className = 'custom-error-msg text-red-500 text-xs mt-2 font-medium italic';
                msg.textContent = err.textContent;
                
                // Map errors back to custom fields based on native selector
                let placed = false;
                for (const customId in customMapping) {
                    const selectorPart = customMapping[customId].replace(/input\[name="|"]/g, '');
                    if (err.closest(`.hs-field-${selectorPart}`) || err.classList.contains(`hs-field-${selectorPart}`)) {
                        document.getElementById(customId).closest('.form-field-group').appendChild(msg);
                        placed = true;
                        break;
                    }
                }
                if (!placed) formContainer.appendChild(msg);
            });
        };

        const observer = new MutationObserver(mirrorErrors);
        observer.observe(nativeForm, { childList: true, subtree: true, attributes: true });
        setTimeout(mirrorErrors, 500);
    };

    // Initialize Login Sync
    if (customLoginUI) {
        setupFormSync(customLoginUI, {
            'custom-login-email': 'input[name="email"], input[type="email"]',
            'custom-login-password': 'input[name="password"], input[type="password"]'
        }, '.hs-membership-form-wrapper form:not([action*="register"])');
        
        // Remember me sync
        const cRem = document.getElementById('custom-login-remember');
        const nRem = nativeContainer.querySelector('.hs-membership-form-wrapper form input[type="checkbox"]');
        if (cRem && nRem) {
            cRem.checked = nRem.checked;
            cRem.addEventListener('change', () => { nRem.checked = cRem.checked; nRem.dispatchEvent(new Event('change', { bubbles: true })); });
        }

        const cReset = document.querySelector('.custom-trigger-reset');
        const nReset = nativeContainer.querySelector('.hs-reset-password');
        if (cReset && nReset) cReset.addEventListener('click', (e) => { e.preventDefault(); nReset.click(); });
    }

    // Initialize Register Sync
    if (customRegisterUI) {
        setupFormSync(customRegisterUI, {
            'custom-register-email': 'input[name="email"]',
            'custom-register-password': 'input[name="password"]',
            'custom-register-password-confirm': 'input[name="password_confirm"]'
        }, '.hs-membership-form-wrapper form[action*="register"]');
    }

    // Initialize Reset Request Sync
    if (customResetRequestUI) {
        setupFormSync(customResetRequestUI, {
            'custom-reset-request-email': 'input[name="email"]'
        }, '.hs-membership-form-wrapper form[action*="password-reset-request"]');
    }

    // Initialize Reset Actual Sync
    if (customResetActualUI) {
        setupFormSync(customResetActualUI, {
            'custom-reset-actual-password': 'input[name="password"]',
            'custom-reset-actual-password-confirm': 'input[name="password_confirm"]'
        }, '.hs-membership-form-wrapper form[action*="password-reset"]');
    }

    // Initialize Password Prompt Sync
    if (customPromptUI) {
        setupFormSync(customPromptUI, {
            'custom-prompt-password': 'input[type="password"]'
        }, '.hs-membership-form-wrapper form');
    }

    // --- Passwordless Password Sync (Delayed injection check) ---
    const checkPasswordless = () => {
        const nativePwSection = document.querySelector('.hs-passwordless-login, .hs-membership-form-wrapper form + div');
        const debugPwArea = document.querySelector('.hs-passwordless-sync-area');
        if (nativePwSection && (nativePwSection.textContent.toLowerCase().includes('enlace por correo') || nativePwSection.textContent.toLowerCase().includes('sin usar una contraseña'))) {
            if (debugPwArea && !debugPwArea.contains(nativePwSection)) { debugPwArea.innerHTML = ''; debugPwArea.appendChild(nativePwSection); }
            const cPwEmail = document.getElementById('custom-passwordless-email');
            const cPwSubmit = document.getElementById('custom-passwordless-submit');
            const nPwForm = nativePwSection.querySelector('form');
            if (nPwForm) {
                syncField(cPwEmail, nPwForm.querySelector('input[type="email"]'));
                const nPwSubmit = nPwForm.querySelector('input[type="submit"], button');
                if (cPwSubmit && nPwSubmit) cPwSubmit.addEventListener('click', (e) => { e.preventDefault(); nPwSubmit.click(); });
            }
        }
    };
    checkPasswordless();
    setTimeout(checkPasswordless, 1000);
    setTimeout(checkPasswordless, 3000);
}

/**
 * Groups subscription checkboxes into a more organized grid.
 */
function refineSubscriptionPreferences() {
    const prefsContainer = document.querySelector('#email-prefs-form');
    if (!prefsContainer) return;

    // 1. Style Header (Title & Email Identity)
    const header = prefsContainer.querySelector('.page-header');
    if (header) {
        const h1 = header.querySelector('h1');
        const h2 = header.querySelector('h2');
        const textNodes = Array.from(header.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

        if (h1) {
            h1.className = 'text-4xl font-extrabold text-primary mb-6 leading-tight tracking-tight';
            // Inject // SYSTEM_PREFERENCES above if not exists
            if (!header.querySelector('.custom-header-tag')) {
                const tag = document.createElement('span');
                tag.className = 'custom-header-tag mono-text text-xs font-medium text-accent tracking-widest block mb-2 uppercase';
                tag.textContent = '// SYSTEM_PREFERENCES';
                h1.parentNode.insertBefore(tag, h1);
            }
        }

        if (h2) {
            // Transform H2 (email) into the identity box
            const email = h2.textContent.trim();
            const identityBox = document.createElement('div');
            identityBox.className = 'bg-accent/10 border-l-4 border-accent p-4 my-6';
            identityBox.innerHTML = `
                <p class="mono-text text-xs uppercase tracking-tighter opacity-70 mb-1 text-primary">PANEL DE CONTROL PARA:</p>
                <p class="mono-text font-semibold text-sm text-primary">[ ${email} ]</p>
            `;
            h2.parentNode.replaceChild(identityBox, h2);
        }

        // Handle the "Security Note" text after H2
        textNodes.forEach(node => {
            if (node.textContent.toLowerCase().includes('ignore this page')) {
                const note = document.createElement('p');
                note.className = 'mono-text text-[10px] text-slate-400 leading-relaxed uppercase mt-4';
                note.innerHTML = `&gt;_ NOTA DE SEGURIDAD: SI ESTA DIRECCIÓN NO TE PERTENECE, IGNORA ESTA PÁGINA PARA MANTENER LA INTEGRIDAD DE LOS DATOS.`;
                node.parentNode.replaceChild(note, node);
            }
        });

        // Remove redundant BRs
        header.querySelectorAll('br').forEach(br => br.remove());
    }

    // 2. Style Subscription Items
    const contentArea = prefsContainer.querySelector('#content');
    if (contentArea) {
        // Style the guidance header
        const guidanceHeader = contentArea.querySelector('p.header');
        if (guidanceHeader) {
            guidanceHeader.className = 'text-slate-600 dark:text-slate-400 text-sm mb-12 max-w-xl leading-relaxed';
            guidanceHeader.textContent = 'Configura tus frecuencias de transmisión y categorías de interés para optimizar el flujo de información técnica.';
        }

        const items = Array.from(contentArea.querySelectorAll('.item'));
        const gridContainer = document.createElement('div');
        gridContainer.className = 'subscription-grid space-y-8 my-12';
        
        items.forEach(item => {
            const labelSpan = item.querySelector('.fakelabel span[id^="label_"]') || item.querySelector('label span') || item.querySelector('label');
            const descP = item.querySelector('p:not(.header)');
            const checkbox = item.querySelector('input[type="checkbox"]');
            const inner = item.querySelector('.item-inner');

            if (checkbox && labelSpan && inner) {
                // Style input
                checkbox.className = 'w-5 h-5 min-w-[1.25rem] min-h-[1.25rem] rounded border-slate-300 text-primary focus:ring-primary mt-1';
                
                // Style Title
                labelSpan.className = 'text-lg font-bold text-[#2D5016] dark:text-[#A3D977] block mb-1 leading-tight';
                
                // Style Description
                if (descP) {
                    descP.className = 'text-slate-500 dark:text-slate-400 text-sm leading-relaxed m-0';
                }

                // Restructure to ensure Title and Description stack
                const textWrapper = document.createElement('div');
                textWrapper.className = 'flex-grow';
                textWrapper.appendChild(labelSpan);
                if (descP) textWrapper.appendChild(descP);

                // Re-build inner
                inner.innerHTML = '';
                inner.className = 'flex items-start gap-4';
                inner.appendChild(checkbox);
                inner.appendChild(textWrapper);

                gridContainer.appendChild(item);
                item.style.display = 'block';
            }
        });

        // Insert grid
        const unsubOptions = contentArea.querySelector('.subscribe-options');
        contentArea.insertBefore(gridContainer, unsubOptions);
    }

    // 3. Style "Unsubscribe All" Section (Footer)
    const unsubOptions = prefsContainer.querySelector('.subscribe-options');
    if (unsubOptions) {
        unsubOptions.className = 'mt-16 pt-12 border-t border-slate-200 dark:border-slate-800';
        
        const header = unsubOptions.querySelector('p.header');
        if (header) {
            header.className = 'mono-text text-xs font-bold text-primary mb-4 uppercase tracking-widest';
            header.textContent = '¿PREFIERES APAGAR LAS TRANSMISIONES?';
        }

        const label = unsubOptions.querySelector('label');
        if (label) {
            // Remove HubSpot's extra margins from the parent paragraph
            const parentP = label.closest('p');
            if (parentP) parentP.className = 'm-0 p-0';

            label.className = 'flex items-center gap-4 group cursor-pointer';
            const checkbox = label.querySelector('input');
            const span = label.querySelector('span');
            
            if (checkbox) {
                checkbox.className = 'w-5 h-5 min-w-[1.25rem] min-h-[1.25rem] flex-shrink-0 rounded border-purple-300 text-purple-600 focus:ring-purple-500';
            }
            if (span) {
                span.className = 'text-sm font-bold text-red-700 dark:text-red-400 group-hover:text-red-600 transition-colors leading-none pt-0.5';
                span.textContent = 'Desconectar de todos los nodos (Baja total).';
            }
        }
    }

    // 4. Final Button Polish
    const mainSubmit = prefsContainer.querySelector('#submitbutton');
    if (mainSubmit) {
        mainSubmit.className = 'w-full bg-primary hover:bg-primary/90 text-accent font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-lg active:scale-95 mt-12';
    }
}

/**
 * Enhances membership forms by grouping labels and inputs, 
 * transform placeholders, and styling buttons.
 */
function refineMembershipForms() {
    const membershipForms = document.querySelectorAll('.hs-membership-form-wrapper form');
    membershipForms.forEach(form => {
        // 1. Group Label + Input + Description
        const elements = Array.from(form.children);
        let currentGroup = null;

        elements.forEach(el => {
            if (el.tagName === 'LABEL') {
                currentGroup = document.createElement('div');
                currentGroup.className = 'form-field-group flex flex-col gap-2 mb-6';
                form.insertBefore(currentGroup, el);
                currentGroup.appendChild(el);
                
                // Add consistent label styling
                el.className = 'text-sm font-semibold text-primary';
            } else if (currentGroup && (el.tagName === 'INPUT' || el.classList.contains('hs-field-description') || el.classList.contains('hs-input'))) {
                currentGroup.appendChild(el);
                
                // Style inputs
                if (el.tagName === 'INPUT' || el.classList.contains('hs-input')) {
                    el.classList.add('w-full', 'px-4', 'py-3', 'rounded-xl', 'border', 'border-slate-200', 'bg-white', 'dark:bg-slate-900', 'dark:border-slate-800', 'focus:ring-2', 'focus:ring-primary/20', 'focus:border-primary', 'outline-none', 'transition-all', 'text-sm');
                }
            }
        });

        // 2. Style Submit Button
        const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
        if (submitBtn) {
            submitBtn.className = 'w-full bg-primary hover:bg-primary/90 text-accent font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-lg active:scale-95';
        }

        // 3. Style Remember Me Checkbox
        const rememberMe = form.querySelector('.hs-field-remember_me');
        if (rememberMe) {
            rememberMe.className = 'flex items-center gap-2 mb-6 text-sm text-slate-500';
            const checkbox = rememberMe.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.className = 'rounded border-slate-300 text-primary focus:ring-primary';
        }

        // 4. Style Reset Password link
        const resetLink = form.querySelector('.hs-reset-password');
        if (resetLink) {
            resetLink.className = 'text-xs text-slate-400 hover:text-primary transition-colors';
        }
    });

    // 5. Handle native HubSpot Passwordless Login section (if separate)
    // We look for any container that has the "passwordless" text or the specific HubSpot class
    const passwordlessSection = document.querySelector('.hs-passwordless-login, .hs-membership-form-wrapper form + div');
    
    if (passwordlessSection && (passwordlessSection.textContent.toLowerCase().includes('enlace por correo') || passwordlessSection.textContent.toLowerCase().includes('sin usar una contraseña'))) {
        
        // Hide clunky HubSpot text nodes like "or" and the long description
        // We can do this by hiding everything and only showing what we want, or targeting specific nodes
        const elements = Array.from(passwordlessSection.querySelectorAll('*'));
        elements.forEach(el => {
            if (el.tagName === 'P' || (el.tagName === 'DIV' && el.textContent.trim() === 'or')) {
                el.style.display = 'none';
            }
        });

        // Add a sleek divider if it doesn't already exist
        if (!document.querySelector('.passwordless-divider')) {
            const divider = document.createElement('div');
            divider.className = 'passwordless-divider relative py-8 w-full max-w-md mx-auto';
            divider.innerHTML = `
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-200 dark:border-slate-800 opacity-50"></div>
                </div>
                <div class="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                    <span class="bg-background-light dark:bg-background-dark px-4 text-slate-400 font-mono">o continúa con</span>
                </div>
            `;
            passwordlessSection.parentNode.insertBefore(divider, passwordlessSection);
        }

        // Add high-tech Title
        if (!document.querySelector('.passwordless-title-injected')) {
             const title = document.createElement('p');
             title.className = 'passwordless-title-injected mono-text text-xs font-bold text-primary flex items-center gap-2 mb-6 uppercase tracking-wider';
             title.innerHTML = `<span class="text-accent">&gt;_</span> ACCESO SIN CONTRASEÑA`;
             passwordlessSection.prepend(title);
        }

        // Style Form, Input and Button
        const pwForm = passwordlessSection.querySelector('form');
        if (pwForm) {
            pwForm.className = 'flex flex-col sm:flex-row gap-3 items-start';
            
            // Clean up the label
            const label = pwForm.querySelector('label');
            if (label) label.style.display = 'none'; 

            const pwInput = pwForm.querySelector('input[type="email"]');
            if (pwInput) {
                pwInput.className = 'flex-grow w-full px-4 py-3 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm';
                pwInput.placeholder = 'Enlace mágico por email';
            }
            
            const pwBtn = pwForm.querySelector('input[type="submit"], button');
            if (pwBtn) {
                pwBtn.className = 'w-full sm:w-auto px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-accent font-bold rounded-xl transition-all text-sm whitespace-nowrap shadow-sm active:scale-95';
                if (pwBtn.tagName === 'INPUT') pwBtn.value = 'Enviar Enlace';
                else pwBtn.textContent = 'Enviar Enlace';
            }
        }
        
        // Style the consent/GDPR checkbox if it exists
        const legalConsent = passwordlessSection.querySelector('.hs-legal-consent-container, .hs-field-consent');
        if (legalConsent) {
            legalConsent.className = 'mt-4 text-[10px] text-slate-500 max-w-xs';
            const checkbox = legalConsent.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.className = 'rounded border-slate-300 text-primary focus:ring-primary mr-2';
        }
    }
}

/**
 * Specific refinements for the subscription confirmation page.
 * Uses Shadow-Sync pattern to map a custom UI to the native hidden module.
 */
function refineSubscriptionConfirmation() {
    const customUI = document.getElementById('custom-confirmation-ui');
    const nativeContainer = document.getElementById('native-confirmation-container');
    
    if (!customUI || !nativeContainer) return;

    // Force display of custom UI first to prevent blank screens
    customUI.style.display = 'block';

    // Textarea toggle: visible only when "Otra variable" (OTHER) is selected
    const customTextareaEl = document.getElementById('custom-confirmation-textarea');
    const customRadioButtons = customUI.querySelectorAll('input[name="custom-unsubscribe-reason"]');
    customRadioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            if (customTextareaEl) {
                if (radio.value === 'OTHER') {
                    customTextareaEl.classList.remove('hidden');
                    customTextareaEl.focus();
                } else {
                    customTextareaEl.classList.add('hidden');
                    customTextareaEl.value = '';
                }
            }
        });
    });

    // Helper to safely sync field changes
    const syncField = (source, target) => {
        if (!source || !target) return;
        source.value = target.value;
        source.addEventListener('input', () => { target.value = source.value; target.dispatchEvent(new Event('input', { bubbles: true })); });
        source.addEventListener('change', () => { target.value = source.value; target.dispatchEvent(new Event('change', { bubbles: true })); });
    };

    const initSync = () => {
        try {
            const confirmationModule = nativeContainer.querySelector('.hs_cos_wrapper_type_email_subscriptions_confirmation');
            if (!confirmationModule) return;

            // 1. Sync Header & Success Messages
            const h2 = confirmationModule.querySelector('h2');
            if (h2 && h2.textContent.trim()) {
                const customEmail = document.getElementById('custom-confirmation-email');
                if (customEmail) {
                    customEmail.textContent = `[ ${h2.textContent.trim()} ]`;
                    customEmail.classList.remove('hidden');
                }
            }

            const successMessages = Array.from(confirmationModule.querySelectorAll('.success, [name*="success"]'));
            const customSuccessContainer = document.getElementById('custom-confirmation-success-msg');
            
            if (customSuccessContainer) {
                // Combine text of all success messages (remove redundant translation defaults if needed)
                const validMsgs = successMessages
                    .map(msg => msg.textContent.trim())
                    .filter(text => text.length > 0 && text !== 'You have successfully updated your email preferences.' && text !== 'You have successfully unsubscribed from:');
                
                if (validMsgs.length > 0) {
                    // Try to extract bold <span> which is the actual list name
                    const listNames = Array.from(confirmationModule.querySelectorAll('.success span'))
                        .map(s => s.textContent.trim())
                        .filter(t => t);
                    
                    if (listNames.length > 0) {
                        customSuccessContainer.innerHTML = 'Has modificado tus suscripciones correctamente:<br><strong>' + listNames.join(', ') + '</strong>';
                    } else {
                        customSuccessContainer.innerHTML = validMsgs.join('<br>');
                    }
                } else {
                    // Default message if HubSpot renders nothing or we fall back
                    customSuccessContainer.textContent = 'Tus preferencias de comunicación en el ecosistema han sido reconfiguradas con éxito.';
                }
            }

            // 2. Sync Diagnostic / Feedback Form
            const nativeSurvey = confirmationModule.querySelector('#hs-subscriptions-unsubscribe-survey');
            const customSurvey = document.getElementById('custom-confirmation-survey');
            
            if (nativeSurvey && customSurvey) {
                customSurvey.classList.remove('hidden');

                // Sync Radios
                const customRadios = customSurvey.querySelectorAll('input[type="radio"]');
                const customTextarea = document.getElementById('custom-confirmation-textarea');
                
                customRadios.forEach(customRadio => {
                    customRadio.addEventListener('change', () => {
                        const val = customRadio.value;
                        const nativeRadio = nativeSurvey.querySelector(`input[type="radio"][value="${val}"]`);
                        if (nativeRadio) {
                            nativeRadio.checked = true;
                            nativeRadio.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        
                        // Show textarea only when "Otra variable" (OTHER) is selected
                        if (customTextarea) {
                            if (val === 'OTHER') {
                                customTextarea.classList.remove('hidden');
                                customTextarea.focus();
                            } else {
                                customTextarea.classList.add('hidden');
                                customTextarea.value = ''; // Clean up text if they select something else
                                // Remember to sync the empty value back to native
                                const nativeTextarea = nativeSurvey.querySelector('textarea');
                                if (nativeTextarea) {
                                  nativeTextarea.value = '';
                                  nativeTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            }
                        }
                    });
                });

                // Sync Textarea
                const nativeTextarea = nativeSurvey.querySelector('textarea');
                if (customTextarea && nativeTextarea) {
                    syncField(customTextarea, nativeTextarea);
                }

                // Sync Submit
                const customSubmit = document.getElementById('custom-confirmation-submit');
                const nativeSubmit = nativeSurvey.querySelector('button[type="submit"], input[type="submit"]');
                if (customSubmit && nativeSubmit) {
                    customSubmit.addEventListener('click', (e) => {
                        e.preventDefault();
                        nativeSubmit.click();
                    });
                }

                // Monitor Success
                const nativeSuccessMsg = confirmationModule.querySelector('#hs-subscriptions-survey-submit-success');
                const customSuccessMsg = document.getElementById('custom-confirmation-survey-success');
                
                if (nativeSuccessMsg && customSuccessMsg) {
                    const observer = new MutationObserver(() => {
                        if (nativeSuccessMsg.style.display !== 'none' || confirmationModule.innerHTML.includes(nativeSuccessMsg.textContent)) {
                            customSurvey.style.display = 'none';
                            customSuccessMsg.classList.remove('hidden');
                        }
                    });
                    observer.observe(nativeSuccessMsg, { attributes: true, attributeFilter: ['style'] });
                    // Double check immediately just in case
                    if (nativeSuccessMsg.style.display !== 'none') {
                        customSurvey.style.display = 'none';
                        customSuccessMsg.classList.remove('hidden');
                    }
                }
            } // End if (nativeSurvey ...)

        } catch (e) {
            console.error('System Refiner: Validation Error in Subscription Sync', e);
        }
    };

    // Retry checking if the dynamic module loads late
    initSync();
    setTimeout(initSync, 1000);
}


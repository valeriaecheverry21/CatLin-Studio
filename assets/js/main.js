document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, once: true, offset: 100 });

    const navbar = document.querySelector('.navbar-custom');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    const servicesContainer = document.getElementById('servicesContainer');
    const bookingContainer = document.getElementById('bookingServices');
    const testimonialsContainer = document.getElementById('testimonialsContainer');

    const bookingState = {
        selectedServices: [],
        date: '',
        time: '',
        client: { name: '', email: '', phone: '' }
    };

    function formatCurrency(amount) {
        return `$${amount.toLocaleString('es-AR')}`;
    }

    function fetchJSON(url) {
        return fetch(url).then(response => {
            if (!response.ok) throw new Error('Error al cargar datos');
            return response.json();
        });
    }

    function showNotification(icon, title, text, confirmButtonText = 'Aceptar') {
        return Swal.fire({ icon, title, text, confirmButtonText, confirmButtonColor: '#d4919b' });
    }

    function showConfirmDialog(title, text, confirmText = 'Sí', cancelText = 'Cancelar') {
        return Swal.fire({
            title, text, icon: 'question',
            showCancelButton: true, confirmButtonText: confirmText,
            cancelButtonText: cancelText, confirmButtonColor: '#d4919b'
        });
    }

    function buildServiceCard(service, showAddButton = false) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.setAttribute('data-aos', 'fade-up');
        col.innerHTML = `
            <div class="service-card h-100" data-service-id="${service.id}">
                <img src="${service.image}" class="card-img-top" alt="${service.name}" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="card-title mb-0">${service.name}</h3>
                        <span class="badge bg-custom">${formatCurrency(service.price)}</span>
                    </div>
                    <p class="card-text flex-grow-1">${service.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <small class="text-muted"><i class="far fa-clock me-1"></i>${service.duration} min</small>
                        ${showAddButton ? `<button class="btn btn-custom btn-sm btn-add-service" data-id="${service.id}"><i class="fas fa-plus me-1"></i>Agregar</button>` : ''}
                    </div>
                    ${service.subservices && service.subservices.length > 0 ? `
                    <ul class="list-unstyled mt-3 mb-0 subservices-list">
                        ${service.subservices.map(s => `<li class="d-flex justify-content-between"><span>${s.name}</span><span class="text-primary">${formatCurrency(s.price)}</span></li>`).join('')}
                    </ul>` : ''}
                </div>
            </div>`;
        return col;
    }

    function renderServices(services, container, showAddButton) {
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        services.forEach(service => {
            fragment.appendChild(buildServiceCard(service, showAddButton));
        });
        container.appendChild(fragment);
        container.querySelectorAll('[data-aos]').forEach(el => {
            el.setAttribute('data-aos-duration', '800');
        });
    }

    function renderTestimonials(testimonials, container) {
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        testimonials.forEach(t => {
            const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.setAttribute('data-aos', 'fade-up');
            col.innerHTML = `
                <div class="testimonial-card">
                    <img src="${t.image}" alt="${t.name}" class="testimonial-img" loading="lazy">
                    <div class="testimonial-stars">${stars}</div>
                    <p class="testimonial-text">"${t.text}"</p>
                    <div class="testimonial-author">${t.name}</div>
                </div>`;
            fragment.appendChild(col);
        });
        container.appendChild(fragment);
    }

    function updateBookingSummary() {
        const summaryList = document.getElementById('bookingSummaryList');
        const summaryTotal = document.getElementById('bookingTotal');
        const bookingCount = document.getElementById('bookingCount');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const bookingSummary = document.getElementById('bookingSummary');

        if (!summaryList) return;

        if (bookingState.selectedServices.length === 0) {
            bookingSummary.classList.add('d-none');
            if (bookingCount) bookingCount.textContent = '0';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        bookingSummary.classList.remove('d-none');
        if (bookingCount) bookingCount.textContent = bookingState.selectedServices.length;
        if (checkoutBtn) checkoutBtn.disabled = false;

        summaryList.innerHTML = '';
        let total = 0;
        bookingState.selectedServices.forEach(service => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>${service.name}</span>
                <span class="d-flex align-items-center gap-2">
                    <span class="fw-bold text-primary">${formatCurrency(service.price)}</span>
                    <button class="btn btn-sm btn-outline-danger remove-service" data-id="${service.id}">&times;</button>
                </span>`;
            summaryList.appendChild(li);
            total += service.price;
        });
        summaryTotal.textContent = formatCurrency(total);
    }

    function scrollToSection(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (servicesContainer) {
        fetchJSON('data/services.json')
            .then(services => renderServices(services, servicesContainer, false))
            .catch(() => {
                servicesContainer.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No se pudieron cargar los servicios. Intente nuevamente más tarde.</p></div>';
            });
    }

    if (bookingContainer) {
        fetchJSON('data/services.json')
            .then(services => {
                renderServices(services, bookingContainer, true);
                bookingContainer.addEventListener('click', (e) => {
                    const addBtn = e.target.closest('.btn-add-service');
                    if (!addBtn) return;
                    const serviceId = parseInt(addBtn.dataset.id);
                    const service = services.find(s => s.id === serviceId);
                    if (!service) return;

                    const alreadySelected = bookingState.selectedServices.some(s => s.id === serviceId);
                    if (alreadySelected) {
                        showNotification('info', 'Servicio ya agregado', `${service.name} ya está en tu reserva.`);
                        return;
                    }

                    bookingState.selectedServices.push({ ...service });
                    updateBookingSummary();

                    const card = addBtn.closest('.service-card');
                    if (card) {
                        addBtn.textContent = 'Agregado';
                        addBtn.disabled = true;
                        addBtn.classList.remove('btn-custom');
                        addBtn.classList.add('btn-success');
                    }

                    showNotification('success', 'Servicio agregado', `${service.name} se agregó a tu reserva.`, 'OK');
                    scrollToSection('bookingSummary');
                });
            })
            .catch(() => {
                bookingContainer.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No se pudieron cargar los servicios para reserva.</p></div>';
            });
    }

    document.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-service');
        if (!removeBtn) return;
        const serviceId = parseInt(removeBtn.dataset.id);
        bookingState.selectedServices = bookingState.selectedServices.filter(s => s.id !== serviceId);
        updateBookingSummary();

        const addBtn = document.querySelector(`.btn-add-service[data-id="${serviceId}"]`);
        if (addBtn) {
            addBtn.textContent = '<i class="fas fa-plus me-1"></i>Agregar';
            addBtn.disabled = false;
            addBtn.classList.remove('btn-success');
            addBtn.classList.add('btn-custom');
        }
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (bookingState.selectedServices.length === 0) {
                showNotification('warning', 'Sin servicios', 'Debes agregar al menos un servicio para continuar.');
                return;
            }
            scrollToSection('bookingForm');
        });
    }

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        const dateInput = document.getElementById('bookingDate');
        const timeSelect = document.getElementById('bookingTime');
        const clientName = document.getElementById('clientName');
        const clientEmail = document.getElementById('clientEmail');
        const clientPhone = document.getElementById('clientPhone');

        const today = new Date().toISOString().split('T')[0];
        if (dateInput) dateInput.setAttribute('min', today);

        function validateForm() {
            const errors = [];
            if (!clientName.value.trim()) errors.push('El nombre es obligatorio.');
            if (!clientEmail.value.trim()) errors.push('El email es obligatorio.');
            if (clientEmail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.value.trim())) {
                errors.push('El email no es válido.');
            }
            if (!dateInput.value) errors.push('Debes seleccionar una fecha.');
            if (!timeSelect.value) errors.push('Debes seleccionar un horario.');
            return errors;
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const errors = validateForm();
            if (errors.length > 0) {
                showNotification('error', 'Completa todos los campos', errors.join('\n'));
                return;
            }

            bookingState.date = dateInput.value;
            bookingState.time = timeSelect.value;
            bookingState.client = {
                name: clientName.value.trim(),
                email: clientEmail.value.trim(),
                phone: clientPhone.value.trim()
            };

            const total = bookingState.selectedServices.reduce((acc, s) => acc + s.price, 0);
            const serviceList = bookingState.selectedServices.map(s => s.name).join(', ');
            const fecha = new Date(bookingState.date).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            Swal.fire({
                title: '¿Confirmar tu reserva?',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Cliente:</strong> ${bookingState.client.name}</p>
                        <p><strong>Servicios:</strong> ${serviceList}</p>
                        <p><strong>Fecha:</strong> ${fecha}</p>
                        <p><strong>Horario:</strong> ${bookingState.time} hs</p>
                        <p><strong>Total:</strong> <span style="color: #d4919b; font-size: 1.3em; font-weight: bold;">${formatCurrency(total)}</span></p>
                    </div>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirmar Reserva',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#d4919b',
                reverseButtons: true
            }).then((result) => {
                if (!result.isConfirmed) return;

                const refNumber = 'CAT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

                Swal.fire({
                    title: '¡Reserva Confirmada!',
                    html: `
                        <div style="text-align: left;">
                            <p style="text-align: center; font-size: 1.2em;">Gracias <strong>${bookingState.client.name}</strong> por reservar en CatLin Studio.</p>
                            <p><strong>N° de Reserva:</strong> <span style="color: #d4919b; font-weight: bold;">${refNumber}</span></p>
                            <p><strong>Servicios:</strong> ${serviceList}</p>
                            <p><strong>Fecha:</strong> ${fecha}</p>
                            <p><strong>Horario:</strong> ${bookingState.time} hs</p>
                            <p><strong>Total:</strong> ${formatCurrency(total)}</p>
                            <hr>
                            <p style="text-align: center; color: #666;">Te esperamos en Av. Principal 123. Llegue 10 minutos antes de su turno.</p>
                        </div>`,
                    icon: 'success',
                    confirmButtonText: 'Finalizar',
                    confirmButtonColor: '#d4919b',
                    allowOutsideClick: false
                }).then(() => {
                    bookingState.selectedServices = [];
                    bookingState.date = '';
                    bookingState.time = '';
                    bookingState.client = { name: '', email: '', phone: '' };
                    bookingForm.reset();
                    updateBookingSummary();
                    document.querySelectorAll('.btn-add-service').forEach(btn => {
                        btn.innerHTML = '<i class="fas fa-plus me-1"></i>Agregar';
                        btn.disabled = false;
                        btn.classList.remove('btn-success');
                        btn.classList.add('btn-custom');
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });
        });

        const inputs = [clientName, clientEmail, clientPhone, dateInput, timeSelect];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    const errorEl = input.nextElementSibling;
                    if (errorEl && errorEl.classList.contains('field-error')) {
                        errorEl.remove();
                    }
                });
            }
        });
    }

    if (testimonialsContainer) {
        fetchJSON('data/testimonials.json')
            .then(testimonials => renderTestimonials(testimonials, testimonialsContainer))
            .catch(() => {
                testimonialsContainer.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No se pudieron cargar los testimonios.</p></div>';
            });
    }

    const servicesPageContainer = document.getElementById('allServicesContainer');
    if (servicesPageContainer) {
        fetchJSON('data/services.json')
            .then(services => {
                const filterBtns = document.querySelectorAll('.filter-btn');
                let currentCategory = 'todos';

                function filterAndRender(category) {
                    const filtered = category === 'todos'
                        ? services
                        : services.filter(s => s.category === category);
                    renderServices(filtered, servicesPageContainer, true);

                    servicesPageContainer.querySelectorAll('.btn-add-service').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = parseInt(btn.dataset.id);
                            const service = services.find(s => s.id === id);
                            if (!service) return;
                            if (bookingState.selectedServices.some(s => s.id === id)) {
                                showNotification('info', 'Ya agregado', `${service.name} ya está en tu reserva.`);
                                return;
                            }
                            bookingState.selectedServices.push({ ...service });
                            updateBookingSummary();
                            btn.textContent = 'Agregado';
                            btn.disabled = true;
                            btn.classList.remove('btn-custom');
                            btn.classList.add('btn-success');
                            showNotification('success', 'Agregado', `${service.name} se agregó a tu reserva.`, 'OK');
                        });
                    });
                }

                filterBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        filterBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        currentCategory = btn.dataset.filter;
                        filterAndRender(currentCategory);
                    });
                });

                filterAndRender('todos');
            })
            .catch(() => {
                servicesPageContainer.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">Error al cargar servicios.</p></div>';
            });
    }
});

/**
 * AutoCare - Vehicle Service Management Application (Pega Platform Blueprint BP-2320)
 * Master Client-Side Application Logic
 * Author: Santhoshkumar S
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Initial State & Case Data
  // ==========================================
  
  const STAGES = [
    { id: 1, name: '1. Request & Booking', persona: 'Customer' },
    { id: 2, name: '2. Intake & Inspection', persona: 'Service Advisor' },
    { id: 3, name: '3. Customer Approval', persona: 'Customer' },
    { id: 4, name: '4. Repairs & Parts', persona: 'Technician' },
    { id: 5, name: '5. Invoicing & Delivery', persona: 'Service Advisor' }
  ];

  let cases = [
    {
      id: 'CAS-2026-0812',
      customerName: 'Rajesh Sharma',
      customerPhone: '+91 98410 88231',
      customerEmail: 'rajesh.sharma@example.com',
      vehicleReg: 'TN 07 BV 4821',
      vehicleModel: 'Toyota Camry 2023',
      mileage: 32000,
      servicePackage: 'Comprehensive Full Service',
      queue: 'GeneralServiceQueue',
      currentStage: 4, // Repairs & Parts
      assignedTech: 'Karthik R. (Bay 2)',
      slaGoalHours: 4,
      slaDeadlineHours: 24,
      slaRemainingSecs: 13338, // 3h 42m
      basePrice: 5999,
      laborHours: 3.5,
      laborRatePerHour: 800,
      additionalParts: [
        { sku: 'BP-F-01', name: 'Front Brake Pad Kit (Ceramic)', price: 2450, qty: 1 },
        { sku: 'OF-SY-02', name: 'Synthetic Engine Oil 5W-30 (4L)', price: 1890, qty: 1 }
      ],
      pendingApproval: false,
      issues: 'Vibration when braking from high speeds, check AC cooling.'
    },
    {
      id: 'CAS-2026-0813',
      customerName: 'Santhoshkumar S',
      customerPhone: '+91 98401 23456',
      customerEmail: 'santhosh.s@pega-nip.com',
      vehicleReg: 'TN 09 DX 7721',
      vehicleModel: 'Hyundai Creta 2024',
      mileage: 22500,
      servicePackage: 'Periodic Maintenance - Basic',
      queue: 'MajorRepairQueue',
      currentStage: 3, // Customer Approval
      assignedTech: 'Manoj Kumar (Bay 4)',
      slaGoalHours: 4,
      slaDeadlineHours: 24,
      slaRemainingSecs: 7200,
      basePrice: 2499,
      laborHours: 2.0,
      laborRatePerHour: 800,
      additionalParts: [
        { sku: 'AF-CAB-03', name: 'Cabin Carbon Air Filter', price: 650, qty: 1 },
        { sku: 'SP-NGK-04', name: 'Iridium Spark Plug Set (4 pcs)', price: 1600, qty: 1 }
      ],
      pendingApproval: true,
      issues: 'Check engine light blinking occasionally, brake pedal feels soft.'
    },
    {
      id: 'CAS-2026-0814',
      customerName: 'Priya Sundaram',
      customerPhone: '+91 97890 11223',
      customerEmail: 'priya.s@example.com',
      vehicleReg: 'KA 03 MK 9012',
      vehicleModel: 'Honda City 2022',
      mileage: 41000,
      servicePackage: 'Brakes & Suspension Overhaul',
      queue: 'GeneralServiceQueue',
      currentStage: 2, // Intake & Inspection
      assignedTech: 'Ramesh V (Bay 1)',
      slaGoalHours: 4,
      slaDeadlineHours: 24,
      slaRemainingSecs: 14000,
      basePrice: 3800,
      laborHours: 3.0,
      laborRatePerHour: 800,
      additionalParts: [],
      pendingApproval: false,
      issues: 'Thudding noise on speed bumps.'
    },
    {
      id: 'CAS-2026-0815',
      customerName: 'Anitha Ramesh',
      customerPhone: '+91 99402 77889',
      customerEmail: 'anitha.r@example.com',
      vehicleReg: 'TN 14 EF 3321',
      vehicleModel: 'Tata Nexon EV 2023',
      mileage: 18000,
      servicePackage: 'Custom Inspection & Minor Repair',
      queue: 'ExpressServiceQueue',
      currentStage: 5, // Invoicing & Delivery
      assignedTech: 'Anand S (Bay 6)',
      slaGoalHours: 2,
      slaDeadlineHours: 12,
      slaRemainingSecs: 3600,
      basePrice: 1500,
      laborHours: 1.5,
      laborRatePerHour: 800,
      additionalParts: [
        { sku: 'CL-RED-05', name: 'Engine Coolant Pre-Mix (2L)', price: 450, qty: 1 }
      ],
      pendingApproval: false,
      issues: 'Periodic 18k checkup, wiper blade replacement.'
    }
  ];

  let selectedCaseId = 'CAS-2026-0812';
  let activeAdvisorParts = [];
  let isTimerRunning = true;
  let timerSeconds = 6322; // 01:45:22

  let notifications = [
    {
      id: 'NOTIF-101',
      caseId: 'CAS-2026-0812',
      recipient: 'rajesh.sharma@example.com',
      type: 'REPAIR_UPDATE',
      title: 'Repairs In Progress · AutoCare Bay 2',
      body: 'Technician Karthik R has begun replacing your front brake pads. Expected completion today by 4:30 PM.',
      time: '12 mins ago'
    },
    {
      id: 'NOTIF-102',
      caseId: 'CAS-2026-0813',
      recipient: 'santhosh.s@pega-nip.com',
      type: 'APPROVAL_REQUIRED',
      title: 'Action Required: Additional Repair Approval',
      body: 'Advisor inspection recommends Iridium Spark Plugs & Carbon Filter replacement (Est: ₹2,250 + taxes). Please review and approve.',
      time: '45 mins ago'
    },
    {
      id: 'NOTIF-103',
      caseId: 'CAS-2026-0815',
      recipient: 'anitha.r@example.com',
      type: 'SERVICE_COMPLETED',
      title: 'Vehicle Ready for Pickup!',
      body: 'Your Tata Nexon EV has passed QA testing and final wash. Invoice generated: ₹2,301.',
      time: '1 hour ago'
    }
  ];

  let inventory = [
    { sku: 'BP-F-01', name: 'Front Brake Pad Kit (Ceramic)', price: 2450, stock: 14, status: 'In Stock' },
    { sku: 'OF-SY-02', name: 'Synthetic Engine Oil 5W-30 (4L)', price: 1890, stock: 28, status: 'In Stock' },
    { sku: 'AF-CAB-03', name: 'Cabin Carbon Air Filter', price: 650, stock: 19, status: 'In Stock' },
    { sku: 'SP-NGK-04', name: 'Iridium Spark Plug Set (4 pcs)', price: 1600, stock: 5, status: 'Low Stock' },
    { sku: 'CL-RED-05', name: 'Engine Coolant Pre-Mix (2L)', price: 450, stock: 22, status: 'In Stock' },
    { sku: 'WP-BOS-06', name: 'Bosch Aerotwin Wiper Blades', price: 950, stock: 3, status: 'Low Stock' }
  ];

  // ==========================================
  // 2. DOM Elements
  // ==========================================
  const roleButtons = document.querySelectorAll('.role-btn');
  const portalTabs = document.querySelectorAll('.portal-tab');
  const caseSelectDropdown = document.getElementById('caseSelectDropdown');
  const stagesTimeline = document.getElementById('stagesTimeline');
  const trackerCaseId = document.getElementById('trackerCaseId');
  const trackerVehicleName = document.getElementById('trackerVehicleName');

  // Customer Form Elements
  const serviceBookingForm = document.getElementById('serviceBookingForm');
  const servicePackageSelect = document.getElementById('servicePackageSelect');
  const previewBaseCost = document.getElementById('previewBaseCost');
  const previewLaborHours = document.getElementById('previewLaborHours');
  const previewTaxes = document.getElementById('previewTaxes');
  const previewTotalCost = document.getElementById('previewTotalCost');
  const customerCasesList = document.getElementById('customerCasesList');
  const approvalWidgetContent = document.getElementById('approvalWidgetContent');

  // Advisor Elements
  const advisorTableBody = document.getElementById('advisorTableBody');
  const advisorQueueFilterBtns = document.querySelectorAll('.filter-pill');
  const addPartBtn = document.getElementById('addPartBtn');
  const partsCatalogSelect = document.getElementById('partsCatalogSelect');
  const partQtyInput = document.getElementById('partQtyInput');
  const selectedPartsContainer = document.getElementById('selectedPartsContainer');
  const saveEstimateAndSendApprovalBtn = document.getElementById('saveEstimateAndSendApprovalBtn');
  const advisorPrintEstimateBtn = document.getElementById('advisorPrintEstimateBtn');
  const dviActiveCaseBadge = document.getElementById('dviActiveCaseBadge');

  // Technician Elements
  const laborTimerDisplay = document.getElementById('laborTimerDisplay');
  const techPauseResumeBtn = document.getElementById('techPauseResumeBtn');
  const techCompleteRepairBtn = document.getElementById('techCompleteRepairBtn');
  const techRequestPartBtn = document.getElementById('techRequestPartBtn');
  const techSlaClock = document.getElementById('techSlaClock');
  const bayQueueGrid = document.getElementById('bayQueueGrid');

  // Manager Elements
  const baysMatrixGrid = document.getElementById('baysMatrixGrid');
  const inventoryTableBody = document.getElementById('inventoryTableBody');
  const currentDateDisplay = document.getElementById('currentDateDisplay');

  // Modals & Drawers
  const invoiceModal = document.getElementById('invoiceModal');
  const closeInvoiceModalBtn = document.getElementById('closeInvoiceModalBtn');
  const invoicePrintContent = document.getElementById('invoicePrintContent');
  const printInvoiceBtn = document.getElementById('printInvoiceBtn');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

  const notifDrawer = document.getElementById('notifDrawer');
  const notifBellBtn = document.getElementById('notifBellBtn');
  const closeNotifDrawerBtn = document.getElementById('closeNotifDrawerBtn');
  const notifFeed = document.getElementById('notifFeed');
  const notifBadgeCount = document.getElementById('notifBadgeCount');
  const toastContainer = document.getElementById('toastContainer');

  // Quick Action Buttons
  document.getElementById('headerBookBtn').addEventListener('click', () => switchTab('customerTab'));
  document.getElementById('heroQuickBookBtn').addEventListener('click', () => switchTab('customerTab'));
  document.getElementById('heroTrackBtn').addEventListener('click', () => {
    document.getElementById('caseTrackerSection').scrollIntoView({ behavior: 'smooth' });
  });

  // ==========================================
  // 3. Navigation & Tab Switcher
  // ==========================================
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  function switchTab(tabId) {
    roleButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
    portalTabs.forEach(p => p.classList.toggle('active', p.id === tabId));
  }

  // Set today's date
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  document.getElementById('preferredDate').value = dateStr;
  if (currentDateDisplay) {
    currentDateDisplay.textContent = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ==========================================
  // 4. Toast Notifications
  // ==========================================
  function showToast(message, icon = '✅') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // 5. Case Lifecycle Timeline Renderer
  // ==========================================
  function renderCaseDropdown() {
    caseSelectDropdown.innerHTML = '';
    cases.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.id} - ${c.vehicleModel} (${c.customerName})`;
      if (c.id === selectedCaseId) opt.selected = true;
      caseSelectDropdown.appendChild(opt);
    });
  }

  function renderLifecycleTimeline() {
    const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
    trackerCaseId.textContent = currentCase.id;
    trackerVehicleName.textContent = `${currentCase.vehicleModel} · ${currentCase.vehicleReg}`;
    if (dviActiveCaseBadge) dviActiveCaseBadge.textContent = `Case: ${currentCase.id}`;

    stagesTimeline.innerHTML = '';
    STAGES.forEach(stage => {
      const node = document.createElement('div');
      let statusClass = 'pending';
      let icon = '⏳';

      if (stage.id < currentCase.currentStage) {
        statusClass = 'completed';
        icon = '✓';
      } else if (stage.id === currentCase.currentStage) {
        statusClass = 'active';
        icon = '⚙️';
      }

      node.className = `stage-node ${statusClass}`;
      node.innerHTML = `
        <div class="stage-header-row">
          <span class="stage-badge-step">Stage ${stage.id}</span>
          <span class="stage-status-icon">${icon}</span>
        </div>
        <div class="stage-name">${stage.name}</div>
        <div class="stage-persona">Assigned: ${stage.persona}</div>
      `;
      stagesTimeline.appendChild(node);
    });
  }

  caseSelectDropdown.addEventListener('change', (e) => {
    selectedCaseId = e.target.value;
    renderLifecycleTimeline();
    renderCustomerCases();
    renderApprovalWidget();
  });

  // ==========================================
  // 6. Dynamic Cost Estimation (US-003)
  // ==========================================
  function updatePreliminaryCost() {
    const selectedOption = servicePackageSelect.options[servicePackageSelect.selectedIndex];
    const baseCost = parseFloat(selectedOption.getAttribute('data-cost')) || 2499;
    const hours = parseFloat(selectedOption.getAttribute('data-hours')) || 2.0;
    const taxes = Math.round(baseCost * 0.18);
    const total = baseCost + taxes;

    previewBaseCost.textContent = `₹${baseCost.toLocaleString()}`;
    previewLaborHours.textContent = `${hours.toFixed(1)} hrs`;
    previewTaxes.textContent = `₹${taxes.toLocaleString()}`;
    previewTotalCost.textContent = `₹${total.toLocaleString()}`;
  }

  servicePackageSelect.addEventListener('change', updatePreliminaryCost);
  updatePreliminaryCost();

  // Handle New Booking Submission (US-001)
  serviceBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const reg = document.getElementById('vehRegNumber').value.trim().toUpperCase();
    const makeModel = document.getElementById('vehMakeModel').value.trim();
    const mileage = parseInt(document.getElementById('vehMileage').value) || 10000;
    const pkgName = servicePackageSelect.options[servicePackageSelect.selectedIndex].text.split('(')[0].trim();
    const basePrice = parseFloat(servicePackageSelect.options[servicePackageSelect.selectedIndex].getAttribute('data-cost')) || 3000;
    const issues = document.getElementById('issueDescription').value.trim();

    const newCaseId = `CAS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCase = {
      id: newCaseId,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      vehicleReg: reg,
      vehicleModel: makeModel,
      mileage: mileage,
      servicePackage: pkgName,
      queue: 'GeneralServiceQueue',
      currentStage: 2, // Moves to Intake & Inspection
      assignedTech: 'Unassigned',
      slaGoalHours: 4,
      slaDeadlineHours: 24,
      slaRemainingSecs: 14400,
      basePrice: basePrice,
      laborHours: 2.5,
      laborRatePerHour: 800,
      additionalParts: [],
      pendingApproval: false,
      issues: issues
    };

    cases.unshift(newCase);
    selectedCaseId = newCaseId;

    // Add Notification
    addNotification({
      caseId: newCaseId,
      recipient: email,
      type: 'BOOKING_CONFIRMED',
      title: `Service Booking Confirmed – [${newCaseId}]`,
      body: `Dear ${name}, your booking for ${makeModel} (${reg}) is confirmed. Case initialized in Pega Platform.`
    });

    renderCaseDropdown();
    renderLifecycleTimeline();
    renderCustomerCases();
    renderAdvisorTable();
    showToast(`Case ${newCaseId} created! Routed to Intake queue.`, '🎉');
  });

  // ==========================================
  // 7. Customer Portal Renderers (US-004 & US-006)
  // ==========================================
  function renderCustomerCases() {
    customerCasesList.innerHTML = '';
    cases.forEach(c => {
      const card = document.createElement('div');
      card.className = `case-item-card ${c.id === selectedCaseId ? 'selected' : ''}`;
      
      let badgeClass = 'badge-blue';
      if (c.currentStage === 3) badgeClass = 'badge-amber';
      if (c.currentStage === 4) badgeClass = 'badge-purple';
      if (c.currentStage === 5) badgeClass = 'badge-emerald';

      const totalVal = calculateTotalCaseCost(c);

      card.innerHTML = `
        <div class="case-main-info">
          <h4>
            ${c.vehicleModel}
            <span class="badge-status ${badgeClass}">Stage ${c.currentStage}: ${STAGES[c.currentStage - 1].name.split('. ')[1]}</span>
          </h4>
          <p>Case ID: <strong>${c.id}</strong> · Reg: <strong>${c.vehicleReg}</strong></p>
          <p>Package: ${c.servicePackage}</p>
        </div>
        <div class="case-side-info">
          <span class="case-price-tag">₹${totalVal.toLocaleString()}</span>
          <p style="font-size:0.75rem; color:var(--text-dim); margin-top:4px;">${c.pendingApproval ? '⚠️ Needs Approval' : 'In Progress'}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        selectedCaseId = c.id;
        renderCaseDropdown();
        renderLifecycleTimeline();
        renderCustomerCases();
        renderApprovalWidget();
      });

      customerCasesList.appendChild(card);
    });
  }

  function calculateTotalCaseCost(c) {
    const partsSum = c.additionalParts.reduce((acc, p) => acc + (p.price * (p.qty || 1)), 0);
    const laborCost = (c.laborHours || 2) * (c.laborRatePerHour || 800);
    const subtotal = c.basePrice + partsSum + laborCost;
    const gst = Math.round(subtotal * 0.18);
    return subtotal + gst;
  }

  function renderApprovalWidget() {
    const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
    const approvalAlertBox = document.getElementById('approvalAlertBox');

    if (!currentCase.pendingApproval) {
      approvalWidgetContent.innerHTML = `
        <div style="padding:1rem; text-align:center; color:var(--text-dim);">
          <p>✓ No pending approvals for Case <strong>${currentCase.id}</strong>.</p>
          <p style="font-size:0.78rem; margin-top:4px;">All inspection recommendations are synchronized.</p>
        </div>
      `;
      approvalAlertBox.classList.remove('border-highlight');
      return;
    }

    approvalAlertBox.classList.add('border-highlight');
    let partsHtml = currentCase.additionalParts.map(p => `
      <div class="approval-item-row">
        <div>
          <strong>${p.name}</strong>
          <div style="font-size:0.72rem; color:var(--text-dim);">SKU: ${p.sku} · Qty: ${p.qty || 1}</div>
        </div>
        <span style="font-weight:700; color:var(--accent-amber);">₹${(p.price * (p.qty || 1)).toLocaleString()}</span>
      </div>
    `).join('');

    const totalEstimated = calculateTotalCaseCost(currentCase);

    approvalWidgetContent.innerHTML = `
      <p style="font-size:0.85rem; color:var(--text-main);">
        Our Service Advisor diagnosed additional repair items required for <strong>${currentCase.vehicleModel}</strong> (${currentCase.vehicleReg}):
      </p>
      <div class="approval-items-box">
        ${partsHtml}
      </div>
      <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.95rem; margin:6px 0;">
        <span>Revised Estimated Total:</span>
        <span style="color:var(--accent-emerald);">₹${totalEstimated.toLocaleString()}</span>
      </div>
      <div class="approval-actions">
        <button class="btn-primary flex-1" id="approveEstimateBtn">✓ Approve & Authorize Repairs</button>
        <button class="btn-secondary flex-1" id="rejectEstimateBtn">✕ Decline Additional Parts</button>
      </div>
    `;

    document.getElementById('approveEstimateBtn').addEventListener('click', () => {
      currentCase.pendingApproval = false;
      currentCase.currentStage = 4; // Advance to Execution
      showToast(`Estimate approved for ${currentCase.id}! Dispatched to Technician.`, '👍');
      renderLifecycleTimeline();
      renderCustomerCases();
      renderApprovalWidget();
      renderAdvisorTable();
    });

    document.getElementById('rejectEstimateBtn').addEventListener('click', () => {
      currentCase.pendingApproval = false;
      currentCase.additionalParts = [];
      currentCase.currentStage = 4;
      showToast(`Additional parts declined. Proceeding with standard service only.`, 'ℹ️');
      renderLifecycleTimeline();
      renderCustomerCases();
      renderApprovalWidget();
      renderAdvisorTable();
    });
  }

  // ==========================================
  // 8. Service Advisor Portal Logic (US-002 & US-010)
  // ==========================================
  let activeQueueFilter = 'all';
  advisorQueueFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      advisorQueueFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeQueueFilter = btn.getAttribute('data-queue');
      renderAdvisorTable();
    });
  });

  function renderAdvisorTable() {
    advisorTableBody.innerHTML = '';
    const filtered = activeQueueFilter === 'all' 
      ? cases 
      : cases.filter(c => c.queue === activeQueueFilter);

    filtered.forEach(c => {
      const tr = document.createElement('tr');
      
      let slaBadge = '<span class="badge-status badge-emerald">On Schedule</span>';
      if (c.slaRemainingSecs < 7200) slaBadge = '<span class="badge-status badge-amber">Goal Due Soon</span>';
      if (c.slaRemainingSecs < 3600) slaBadge = '<span class="badge-status badge-rose">Urgent SLA</span>';

      tr.innerHTML = `
        <td><strong>${c.id}</strong></td>
        <td>
          <div><strong>${c.vehicleModel}</strong></div>
          <div style="font-size:0.75rem; color:var(--text-dim);">${c.vehicleReg}</div>
        </td>
        <td>${c.customerName}</td>
        <td><span class="badge-status badge-blue">${c.queue.replace('Queue', '')}</span></td>
        <td>Stage ${c.currentStage}: ${STAGES[c.currentStage-1].name.split('. ')[1]}</td>
        <td>${slaBadge}</td>
        <td>
          <button class="btn-sm-action select-case-advisor-btn" data-id="${c.id}">Inspect & DVI</button>
        </td>
      `;

      tr.querySelector('.select-case-advisor-btn').addEventListener('click', () => {
        selectedCaseId = c.id;
        renderCaseDropdown();
        renderLifecycleTimeline();
        renderCustomerCases();
        renderApprovalWidget();
        document.getElementById('advisorDviPanel').scrollIntoView({ behavior: 'smooth' });
        showToast(`Loaded Case ${c.id} into DVI inspection bench.`, '🔍');
      });

      advisorTableBody.appendChild(tr);
    });
  }

  // Advisor Spare Parts Builder
  addPartBtn.addEventListener('click', () => {
    const selectedOpt = partsCatalogSelect.options[partsCatalogSelect.selectedIndex];
    const sku = selectedOpt.value;
    const name = selectedOpt.getAttribute('data-name');
    const price = parseFloat(selectedOpt.getAttribute('data-price'));
    const qty = parseInt(partQtyInput.value) || 1;

    activeAdvisorParts.push({ sku, name, price, qty });
    renderSelectedAdvisorParts();
    showToast(`Added ${name} to estimate.`, '📦');
  });

  function renderSelectedAdvisorParts() {
    selectedPartsContainer.innerHTML = '';
    if (activeAdvisorParts.length === 0) {
      selectedPartsContainer.innerHTML = '<span style="font-size:0.78rem; color:var(--text-dim);">No extra parts added yet.</span>';
      return;
    }

    activeAdvisorParts.forEach((part, index) => {
      const row = document.createElement('div');
      row.className = 'part-pill-row';
      row.innerHTML = `
        <span><strong>${part.name}</strong> (${part.qty}x) · ₹${(part.price * part.qty).toLocaleString()}</span>
        <button class="part-remove-btn" data-index="${index}">&times;</button>
      `;
      row.querySelector('.part-remove-btn').addEventListener('click', () => {
        activeAdvisorParts.splice(index, 1);
        renderSelectedAdvisorParts();
      });
      selectedPartsContainer.appendChild(row);
    });
  }

  saveEstimateAndSendApprovalBtn.addEventListener('click', () => {
    const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
    currentCase.additionalParts = [...activeAdvisorParts];
    currentCase.assignedTech = document.getElementById('assignTechSelect').value;
    currentCase.laborHours = parseFloat(document.getElementById('advisorEstimateHours').value) || 3.5;
    
    if (activeAdvisorParts.length > 0) {
      currentCase.pendingApproval = true;
      currentCase.currentStage = 3; // Customer Approval Stage
      addNotification({
        caseId: currentCase.id,
        recipient: currentCase.customerEmail,
        type: 'APPROVAL_REQUIRED',
        title: `Action Required: Service Estimate for ${currentCase.vehicleModel}`,
        body: `Advisor has submitted inspection findings. Additional parts totaling ₹${activeAdvisorParts.reduce((a,b)=>a+b.price*b.qty,0)} require your digital approval.`
      });
      showToast(`DVI Submitted! Sent approval alert to ${currentCase.customerName}.`, '📤');
    } else {
      currentCase.currentStage = 4; // Advance straight to technician
      showToast(`DVI Completed! Case routed to Technician work order.`, '🚀');
    }

    renderLifecycleTimeline();
    renderCustomerCases();
    renderApprovalWidget();
    renderAdvisorTable();
  });

  // ==========================================
  // 9. Technician Workbench (US-007 & US-009)
  // ==========================================
  function updateLaborTimer() {
    if (!isTimerRunning) return;
    timerSeconds++;
    const hrs = Math.floor(timerSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (timerSeconds % 60).toString().padStart(2, '0');
    laborTimerDisplay.textContent = `${hrs}:${mins}:${secs}`;
  }

  setInterval(updateLaborTimer, 1000);

  techPauseResumeBtn.addEventListener('click', () => {
    isTimerRunning = !isTimerRunning;
    techPauseResumeBtn.textContent = isTimerRunning ? '⏸ Pause Timer' : '▶ Resume Timer';
    showToast(isTimerRunning ? 'Labor timer resumed.' : 'Labor timer paused.', '⏱️');
  });

  techCompleteRepairBtn.addEventListener('click', () => {
    const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
    currentCase.currentStage = 5; // Invoicing & Delivery
    showToast(`Repairs & QC sign-off completed for ${currentCase.id}! Ready for invoice.`, '🏆');
    
    addNotification({
      caseId: currentCase.id,
      recipient: currentCase.customerEmail,
      type: 'SERVICE_COMPLETED',
      title: `Vehicle Service Completed & Ready for Pickup – [${currentCase.id}]`,
      body: `Dear ${currentCase.customerName}, your ${currentCase.vehicleModel} is ready for pickup at AutoCare Bay 2.`
    });

    renderLifecycleTimeline();
    renderCustomerCases();
    renderAdvisorTable();
    openInvoiceModal(currentCase);
  });

  techRequestPartBtn.addEventListener('click', () => {
    showToast('Requisition request sent to Spare Parts Coordinator.', '📦');
  });

  function renderBayQueue() {
    bayQueueGrid.innerHTML = '';
    const pendingCases = cases.filter(c => c.currentStage === 4 || c.currentStage === 2);
    
    pendingCases.forEach(c => {
      const card = document.createElement('div');
      card.className = 'bay-card occupied';
      card.innerHTML = `
        <div class="bay-number">${c.id}</div>
        <div class="bay-status" style="color:var(--accent-amber);">${c.servicePackage}</div>
        <div class="bay-vehicle">${c.vehicleModel} (${c.vehicleReg})</div>
        <button class="btn-sm-action mt-4 load-tech-job-btn" data-id="${c.id}">Load into Bay</button>
      `;

      card.querySelector('.load-tech-job-btn').addEventListener('click', () => {
        selectedCaseId = c.id;
        document.getElementById('techJobTitle').textContent = `Case ${c.id} · ${c.vehicleModel}`;
        renderLifecycleTimeline();
        showToast(`Loaded ${c.id} onto Technician workbench.`, '🔧');
      });

      bayQueueGrid.appendChild(card);
    });
  }

  // ==========================================
  // 10. Manager Matrix & Inventory
  // ==========================================
  function renderManagerBays() {
    baysMatrixGrid.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
      const isOccupied = i <= 5;
      const card = document.createElement('div');
      card.className = `bay-card ${isOccupied ? 'occupied' : 'available'}`;
      card.innerHTML = `
        <div class="bay-number">Bay 0${i} ${i <= 4 ? '(Hydraulic Lift)' : '(Inspection Bay)'}</div>
        <div class="bay-status" style="color:${isOccupied ? 'var(--accent-blue)' : 'var(--accent-emerald)'}">
          ${isOccupied ? '● In Progress' : '○ Available'}
        </div>
        <div class="bay-vehicle">${isOccupied ? (cases[i % cases.length]?.vehicleModel || 'Active Repair') : 'Ready for Intake'}</div>
      `;
      baysMatrixGrid.appendChild(card);
    }
  }

  function renderInventoryTable() {
    inventoryTableBody.innerHTML = '';
    inventory.forEach(item => {
      const tr = document.createElement('tr');
      const isLow = item.stock <= 5;
      tr.innerHTML = `
        <td><strong>${item.sku}</strong></td>
        <td>${item.name}</td>
        <td>₹${item.price.toLocaleString()}</td>
        <td>${item.stock} units</td>
        <td>
          <span class="badge-status ${isLow ? 'badge-rose' : 'badge-emerald'}">
            ${item.status}
          </span>
        </td>
      `;
      inventoryTableBody.appendChild(tr);
    });
  }

  document.getElementById('mgrAddPartBtn')?.addEventListener('click', () => {
    inventory[3].stock += 10;
    inventory[3].status = 'In Stock';
    renderInventoryTable();
    showToast('Restocked Iridium Spark Plugs (+10 units).', '📦');
  });

  // ==========================================
  // 11. Invoice Modal & Print (US-008 Template)
  // ==========================================
  function openInvoiceModal(c) {
    const partsSum = c.additionalParts.reduce((acc, p) => acc + (p.price * (p.qty || 1)), 0);
    const laborCost = (c.laborHours || 2) * (c.laborRatePerHour || 800);
    const subtotal = c.basePrice + partsSum + laborCost;
    const gst = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gst;

    let partsRowHtml = c.additionalParts.map(p => `
      <tr>
        <td>${p.name} (${p.sku})</td>
        <td>${p.qty || 1}</td>
        <td>₹${p.price.toLocaleString()}</td>
        <td style="text-align:right;">₹${(p.price * (p.qty || 1)).toLocaleString()}</td>
      </tr>
    `).join('');

    invoicePrintContent.innerHTML = `
      <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem; display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h2 style="font-family:var(--font-heading); color:var(--text-main);">AutoCare Vehicle Services</h2>
          <p style="font-size:0.8rem; color:var(--text-dim);">Pega Certified Automotive Service Hub · GSTIN: 33AAAAA0000A1Z5</p>
        </div>
        <div style="text-align:right;">
          <h3 style="color:var(--accent-emerald);">TAX INVOICE</h3>
          <p style="font-size:0.8rem; color:var(--text-muted);">Invoice #: INV-2026-${c.id.split('-')[2]}</p>
          <p style="font-size:0.8rem; color:var(--text-muted);">Date: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:1.25rem; font-size:0.85rem;">
        <div style="background:var(--bg-primary); padding:1rem; border-radius:var(--radius-md);">
          <strong style="color:var(--accent-cyan);">CUSTOMER DETAILS:</strong>
          <p><strong>${c.customerName}</strong></p>
          <p>${c.customerPhone}</p>
          <p>${c.customerEmail}</p>
        </div>
        <div style="background:var(--bg-primary); padding:1rem; border-radius:var(--radius-md);">
          <strong style="color:var(--accent-cyan);">VEHICLE DETAILS:</strong>
          <p><strong>${c.vehicleModel}</strong></p>
          <p>Reg: <strong>${c.vehicleReg}</strong> | Odometer: ${c.mileage} km</p>
          <p>Assigned Tech: ${c.assignedTech}</p>
        </div>
      </div>

      <table class="app-table" style="margin-bottom:1.25rem;">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty/Hrs</th>
            <th>Rate</th>
            <th style="text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${c.servicePackage} (Base Package)</td>
            <td>1</td>
            <td>₹${c.basePrice.toLocaleString()}</td>
            <td style="text-align:right;">₹${c.basePrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Technician Diagnostic & Repair Labor</td>
            <td>${c.laborHours} hrs</td>
            <td>₹${c.laborRatePerHour}/hr</td>
            <td style="text-align:right;">₹${laborCost.toLocaleString()}</td>
          </tr>
          ${partsRowHtml}
        </tbody>
      </table>

      <div style="margin-left:auto; width:280px; display:flex; flex-direction:column; gap:6px; font-size:0.9rem;">
        <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
          <span>Subtotal:</span>
          <span>₹${subtotal.toLocaleString()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
          <span>GST (18%):</span>
          <span>₹${gst.toLocaleString()}</span>
        </div>
        <div style="height:1px; background:var(--border-color); margin:4px 0;"></div>
        <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.15rem; color:var(--accent-emerald);">
          <span>Total Amount:</span>
          <span>₹${grandTotal.toLocaleString()}</span>
        </div>
      </div>
    `;

    invoiceModal.classList.add('active');
  }

  advisorPrintEstimateBtn.addEventListener('click', () => {
    const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
    openInvoiceModal(currentCase);
  });

  closeInvoiceModalBtn.addEventListener('click', () => invoiceModal.classList.remove('active'));
  printInvoiceBtn.addEventListener('click', () => window.print());

  confirmPaymentBtn.addEventListener('click', () => {
    invoiceModal.classList.remove('active');
    showToast('Payment confirmed! Case successfully resolved in Pega Platform.', '🎉');
  });

  // ==========================================
  // 12. Notifications Drawer & Feed
  // ==========================================
  function addNotification(notif) {
    notifications.unshift({
      id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
      time: 'Just now',
      ...notif
    });
    renderNotifications();
  }

  function renderNotifications() {
    notifFeed.innerHTML = '';
    notifBadgeCount.textContent = notifications.length;
    notifications.forEach(n => {
      const item = document.createElement('div');
      item.className = 'notif-item';
      item.innerHTML = `
        <div class="notif-head">
          <span style="color:var(--accent-cyan); font-weight:700;">${n.caseId}</span>
          <span>${n.time}</span>
        </div>
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
      `;
      notifFeed.appendChild(item);
    });
  }

  notifBellBtn.addEventListener('click', () => notifDrawer.classList.add('active'));
  closeNotifDrawerBtn.addEventListener('click', () => notifDrawer.classList.remove('active'));

  // Close modals when clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === invoiceModal) invoiceModal.classList.remove('active');
    if (e.target === notifDrawer) notifDrawer.classList.remove('active');
  });

  // ==========================================
  // 13. Initialize Everything
  // ==========================================
  renderCaseDropdown();
  renderLifecycleTimeline();
  renderCustomerCases();
  renderApprovalWidget();
  renderAdvisorTable();
  renderSelectedAdvisorParts();
  renderBayQueue();
  renderManagerBays();
  renderInventoryTable();
  renderNotifications();
});

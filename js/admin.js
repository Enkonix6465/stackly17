// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.admin-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items and sections
            menuItems.forEach(menu => menu.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-actions .btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            switch(action) {
                case 'Add New Property':
                    showAddPropertyModal();
                    break;
                case 'Manage Users':
                    switchToSection('users');
                    break;
                case 'View Reports':
                    switchToSection('analytics');
                    break;
                case 'Send Newsletter':
                    showNewsletterModal();
                    break;
                default:
                    alert(`${action} functionality would be implemented here.`);
            }
        });
    });
    
    // Property management
    const addPropertyBtns = document.querySelectorAll('button[class*="btn-primary"]');
    addPropertyBtns.forEach(btn => {
        if (btn.textContent.includes('Add New Property')) {
            btn.addEventListener('click', showAddPropertyModal);
        }
    });
    
    // Edit and delete buttons for tables
    const editBtns = document.querySelectorAll('.btn-icon.edit');
    const deleteBtns = document.querySelectorAll('.btn-icon.delete');
    
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.querySelector('td').textContent;
            const name = row.querySelectorAll('td')[1].textContent;
            
            if (confirm(`Edit item: ${name}?`)) {
                alert(`Edit functionality for ID ${id} would be implemented here.`);
            }
        });
    });
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.querySelector('td').textContent;
            const name = row.querySelectorAll('td')[1].textContent;
            
            if (confirm(`Are you sure you want to delete: ${name}?`)) {
                row.remove();
                showNotification(`${name} has been deleted.`, 'success');
            }
        });
    });
    
    // Inquiry management
    const inquiryBtns = document.querySelectorAll('.inquiry-actions .btn');
    inquiryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const inquiry = this.closest('.inquiry-card');
            const inquiryTitle = inquiry.querySelector('h3').textContent;
            
            if (this.textContent.includes('Reply')) {
                showReplyModal(inquiryTitle);
            } else if (this.textContent.includes('Mark as Resolved')) {
                markInquiryResolved(inquiry);
            }
        });
    });
    
    // Settings forms
    const settingsForms = document.querySelectorAll('.settings-card form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formTitle = this.closest('.settings-card').querySelector('h3').textContent;
            showNotification(`${formTitle} updated successfully!`, 'success');
            
            // Simulate saving delay
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    });
    
    // Filter functionality for inquiries
    const filterSelect = document.querySelector('.filter-controls select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterInquiries(this.value);
        });
    }
    
    // Date range functionality for analytics
    const dateInputs = document.querySelectorAll('.date-range input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateAnalytics();
        });
    });
    
    // Initialize dashboard stats animation
    animateStats();
    
    // Auto-refresh dashboard data every 30 seconds
    setInterval(() => {
        if (document.getElementById('dashboard').classList.contains('active')) {
            refreshDashboardData();
        }
    }, 30000);
});

// Helper functions
function switchToSection(sectionId) {
    // Remove active class from all menu items and sections
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
    
    // Activate target section
    const targetMenuItem = document.querySelector(`[data-section="${sectionId}"]`);
    const targetSection = document.getElementById(sectionId);
    
    if (targetMenuItem && targetSection) {
        targetMenuItem.classList.add('active');
        targetSection.classList.add('active');
    }
}

function showAddPropertyModal() {
    const modal = createModal('Add New Property', `
        <form id="addPropertyForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Property Name</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Property Type</label>
                    <select name="type" required>
                        <option value="">Select Type</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Price</label>
                    <input type="number" name="price" min="0" required>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status" required>
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="3"></textarea>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-primary">Add Property</button>
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    
    document.getElementById('addPropertyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const propertyData = {};
        formData.forEach((value, key) => {
            propertyData[key] = value;
        });
        
        // Add property to table (in real app, this would be an API call)
        addPropertyToTable(propertyData);
        
        closeModal();
        showNotification('Property added successfully!', 'success');
    });
}

function showReplyModal(inquiryTitle) {
    const modal = createModal(`Reply to: ${inquiryTitle}`, `
        <form id="replyForm">
            <div class="form-group">
                <label>Reply Message</label>
                <textarea name="reply" rows="5" placeholder="Type your reply here..." required></textarea>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-primary">Send Reply</button>
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    
    document.getElementById('replyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        closeModal();
        showNotification('Reply sent successfully!', 'success');
    });
}

function showNewsletterModal() {
    const modal = createModal('Send Newsletter', `
        <form id="newsletterForm">
            <div class="form-group">
                <label>Subject</label>
                <input type="text" name="subject" placeholder="Newsletter Subject" required>
            </div>
            <div class="form-group">
                <label>Recipients</label>
                <select name="recipients" required>
                    <option value="all">All Subscribers</option>
                    <option value="clients">Clients Only</option>
                    <option value="agents">Agents Only</option>
                </select>
            </div>
            <div class="form-group">
                <label>Message</label>
                <textarea name="message" rows="6" placeholder="Newsletter content..." required></textarea>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-primary">Send Newsletter</button>
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        closeModal();
        showNotification('Newsletter sent successfully!', 'success');
    });
}

function createModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.getElementById('adminModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeModal()">&times;</span>
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

function closeModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.remove();
    }
}

function addPropertyToTable(propertyData) {
    const tableBody = document.querySelector('#properties .admin-table tbody');
    if (tableBody) {
        const newRow = document.createElement('tr');
        const newId = String(Date.now()).slice(-3); // Simple ID generation
        
        newRow.innerHTML = `
            <td>${newId}</td>
            <td>${propertyData.name}</td>
            <td>${propertyData.type}</td>
            <td>$${parseInt(propertyData.price).toLocaleString()}</td>
            <td><span class="status ${propertyData.status}">${propertyData.status}</span></td>
            <td>
                <button class="btn-icon edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(newRow);
        
        // Add event listeners to new buttons
        newRow.querySelector('.btn-icon.edit').addEventListener('click', function() {
            alert(`Edit functionality for ${propertyData.name} would be implemented here.`);
        });
        
        newRow.querySelector('.btn-icon.delete').addEventListener('click', function() {
            if (confirm(`Delete ${propertyData.name}?`)) {
                newRow.remove();
                showNotification(`${propertyData.name} deleted.`, 'success');
            }
        });
    }
}

function markInquiryResolved(inquiryCard) {
    const statusSpan = inquiryCard.querySelector('.inquiry-status');
    statusSpan.textContent = 'Resolved';
    statusSpan.className = 'inquiry-status resolved';
    statusSpan.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
    statusSpan.style.color = '#27ae60';
    
    // Hide action buttons
    const actionsDiv = inquiryCard.querySelector('.inquiry-actions');
    actionsDiv.style.display = 'none';
    
    showNotification('Inquiry marked as resolved!', 'success');
}

function filterInquiries(status) {
    const inquiryCards = document.querySelectorAll('.inquiry-card');
    
    inquiryCards.forEach(card => {
        const inquiryStatus = card.querySelector('.inquiry-status').textContent.toLowerCase();
        
        if (status === 'All Inquiries' || inquiryStatus === status.toLowerCase()) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function updateAnalytics() {
    // Simulate updating charts based on date range
    const charts = document.querySelectorAll('.chart-placeholder');
    
    charts.forEach(chart => {
        chart.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <p>Updating chart data...</p>
        `;
        
        setTimeout(() => {
            const chartType = chart.parentElement.querySelector('h3').textContent;
            chart.innerHTML = `
                <i class="fas fa-chart-line"></i>
                <p>${chartType} updated for selected date range</p>
            `;
        }, 1500);
    });
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-info h3');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        
        if (numValue) {
            let current = 0;
            const increment = numValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numValue) {
                    current = numValue;
                    clearInterval(timer);
                }
                
                if (finalValue.includes('$')) {
                    stat.textContent = '$' + Math.floor(current).toLocaleString();
                    if (finalValue.includes('M')) {
                        stat.textContent += 'M';
                    }
                } else if (finalValue.includes('+')) {
                    stat.textContent = Math.floor(current).toLocaleString() + '+';
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, 30);
        }
    });
}

function refreshDashboardData() {
    // Simulate refreshing dashboard data
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        const activities = [
            'New property added: Luxury Villa Downtown',
            'User Sarah Wilson submitted inquiry',
            'Property updated: Modern Apartment Complex',
            'New user registration: Alex Johnson',
            'Property sold: Cozy Family Home #456'
        ];
        
        // Add a new activity to the top
        const newActivity = document.createElement('li');
        newActivity.textContent = activities[Math.floor(Math.random() * activities.length)];
        newActivity.style.backgroundColor = 'rgba(52, 144, 220, 0.1)';
        
        activityList.insertBefore(newActivity, activityList.firstChild);
        
        // Remove the last item if there are more than 5
        if (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            newActivity.style.backgroundColor = '';
        }, 3000);
    }
}

// Notification system for admin (reuse from main script)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.zIndex = '10000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    if (type === 'success') {
        notification.style.backgroundColor = '#27ae60';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else {
        notification.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('adminModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Export data functionality
function exportData(type) {
    alert(`Exporting ${type} data as CSV would be implemented here.`);
}

// Bulk actions for tables
function selectAll(checkbox) {
    const checkboxes = checkbox.closest('table').querySelectorAll('input[type="checkbox"]:not(.select-all)');
    checkboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
}

function bulkDelete() {
    const selectedItems = document.querySelectorAll('table input[type="checkbox"]:checked:not(.select-all)');
    if (selectedItems.length === 0) {
        alert('Please select items to delete.');
        return;
    }
    
    if (confirm(`Delete ${selectedItems.length} selected items?`)) {
        selectedItems.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.remove();
        });
        showNotification(`${selectedItems.length} items deleted successfully.`, 'success');
    }
}

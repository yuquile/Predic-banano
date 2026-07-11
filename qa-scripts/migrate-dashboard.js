const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../css/pages/dashboard.css');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove :root block
content = content.replace(/:root\s*\{[\s\S]*?\}/, '/* :root centralizado en theme.css */');

// 2. Update utility classes
content = content.replace(/--primary/g, '--color-primary');
content = content.replace(/--primary-light/g, '--color-primary-light');
content = content.replace(/--accent/g, '--color-secondary');
content = content.replace(/--bg/g, '--color-background');
content = content.replace(/--card-bg/g, '--color-card');
content = content.replace(/--card-secondary/g, '--color-surface');
content = content.replace(/--text-main/g, '--text-primary');
content = content.replace(/--border-color/g, '--color-border');

// 3. Update Badges
content = content.replace(/\.badge-activo\s*\{[\s\S]*?\}/, `.badge-activo {\n  background-color: var(--status-success);\n  color: #ffffff;\n  border: none;\n}`);
content = content.replace(/\.badge-riesgo-alto\s*\{[\s\S]*?\}/, `.badge-riesgo-alto {\n  background-color: var(--risk-high);\n  color: #ffffff;\n  border: none;\n}`);

// 4. Update Statuses
content = content.replace(/\.status-pendiente\s*\{[\s\S]*?\}/, `.status-pendiente {\n  color: var(--status-warning);\n  background-color: rgba(216, 167, 77, 0.1);\n  border: 1px solid rgba(216, 167, 77, 0.25);\n}`);
content = content.replace(/\.status-proceso\s*\{[\s\S]*?\}/, `.status-proceso {\n  color: var(--status-info);\n  background-color: rgba(107, 158, 207, 0.1);\n  border: 1px solid rgba(107, 158, 207, 0.25);\n}`);
content = content.replace(/\.status-enviado\s*\{[\s\S]*?\}/, `.status-enviado {\n  color: var(--color-primary-dark);\n  background-color: rgba(45, 106, 90, 0.1);\n  border: 1px solid rgba(45, 106, 90, 0.25);\n}`);
content = content.replace(/\.status-entregado\s*\{[\s\S]*?\}/, `.status-entregado {\n  color: var(--status-success);\n  background-color: rgba(111, 175, 138, 0.1);\n  border: 1px solid rgba(111, 175, 138, 0.25);\n}`);

// 5. Update Sidebar Links
content = content.replace(/\.menu-link\s*\{[\s\S]*?\}/, `.menu-link {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.625rem 0.75rem;\n  border-radius: 4px;\n  margin-bottom: 0.125rem;\n  transition: all 0.2s;\n  background-color: transparent;\n  color: var(--sidebar-icon);\n  font-size: 0.9063rem;\n  font-weight: 400;\n  border-left: 3px solid transparent;\n  text-decoration: none;\n}`);
content = content.replace(/\.menu-link:hover\s*\{[\s\S]*?\}/, `.menu-link:hover {\n  background-color: var(--sidebar-hover);\n  color: var(--sidebar-text);\n}`);
content = content.replace(/\.menu-link\.active\s*\{[\s\S]*?\}/, `.menu-link.active {\n  background-color: var(--sidebar-active);\n  color: var(--sidebar-text);\n  font-weight: 500;\n  border-left: 3px solid var(--sidebar-icon);\n  border-radius: 0 4px 4px 0;\n}`);

fs.writeFileSync(filePath, content);
console.log('dashboard.css migrated.');

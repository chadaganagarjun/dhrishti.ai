const API = '/api';
const token = () => localStorage.getItem('drishti_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', ...(token() ? { Authorization: `Bearer ${token()}` } : {}) });
async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) { localStorage.removeItem('drishti_token'); if (!location.pathname.endsWith('login.html')) location.href = '/login.html'; }
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
function toast(message, error = false) { const node = document.createElement('div'); node.className = `toast${error ? ' error' : ''}`; node.textContent = message; document.body.appendChild(node); setTimeout(() => node.remove(), 3200); }
function money(value) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0)); }
function dateLabel(value) { if (!value) return '—'; return new Date(`${String(value).slice(0,10)}T00:00:00`).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
function statusTag(value) { const cls = String(value || '').toLowerCase().replaceAll(' ','-'); return `<span class="status ${cls}">${value || 'Unknown'}</span>`; }
function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function requireAuth() {
  if (location.pathname.endsWith('login.html') || location.pathname === '/') return;
  if (!token()) { location.href = '/login.html'; return; }
  const user = JSON.parse(localStorage.getItem('drishti_user') || '{}');
  const label = document.getElementById('sidebar-user');
  if (label && user.name) label.innerHTML = `${escapeHTML(user.name)}<small>${escapeHTML(user.role || 'Project manager')}</small>`;
  const page = document.querySelector('#page-content')?.dataset.page;
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  const date = document.getElementById('today-date');
  if (date) date.textContent = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.endsWith('login.html') || location.pathname === '/') {
    document.getElementById('login-form')?.addEventListener('submit', async event => {
      event.preventDefault(); const form = new FormData(event.currentTarget); const error = document.getElementById('login-error');
      try { const data = await api('/auth/login', { method:'POST', body:JSON.stringify({ email:form.get('email'), password:form.get('password') }) }); localStorage.setItem('drishti_token', data.token); localStorage.setItem('drishti_user', JSON.stringify(data.user)); location.href='/dashboard.html'; }
      catch (err) { error.textContent = err.message; }
    });
  } else {
    requireAuth();
    document.getElementById('logout-button')?.addEventListener('click', () => { localStorage.removeItem('drishti_token'); localStorage.removeItem('drishti_user'); location.href='/login.html'; });
  }
});

async function renderCrudPage(config) {
  const root=document.getElementById('page-content'); if(!root)return;
  const fieldHTML=field=>{const value=field.value||'';if(field.type==='textarea')return `<label>${field.label}<textarea name="${field.name}" ${field.required?'required':''}>${escapeHTML(value)}</textarea></label>`;if(field.type==='select')return `<label>${field.label}<select name="${field.name}">${field.options.map(o=>`<option value="${o}" ${o===value?'selected':''}>${o}</option>`).join('')}</select></label>`;return `<label>${field.label}<input name="${field.name}" type="${field.type||'text'}" value="${escapeHTML(value)}" ${field.required?'required':''} ${field.type==='number'?'min="0"':''}></label>`;};
  root.innerHTML=`<div class="toolbar"><div><h2>${config.title}</h2><p class="muted">Create, review and maintain records.</p></div><div class="actions"><input class="search" id="table-search" placeholder="Search records"><button class="button primary" id="add-record">+ Add new</button></div></div><section class="form-card hidden" id="record-form-card"><h2 id="form-heading">Add record</h2><form id="record-form"><div class="form-grid">${config.fields.map(fieldHTML).join('')}</div><p id="record-error" class="form-error"></p><div class="actions"><button class="button primary" type="submit">Save record</button><button class="button" type="button" id="cancel-form">Cancel</button></div></form></section><section class="panel"><div class="table-wrap"><table><thead><tr>${config.columns.map(c=>`<th>${c.label}</th>`).join('')}<th>Actions</th></tr></thead><tbody id="records-body"><tr><td colspan="${config.columns.length+1}">Loading records...</td></tr></tbody></table></div></section>`;
  const card=document.getElementById('record-form-card'),form=document.getElementById('record-form');let records=[],editing=null;
  const draw=(list=records)=>{document.getElementById('records-body').innerHTML=list.length?list.map(row=>`<tr>${config.columns.map(col=>`<td>${col.format?col.format(row[col.key]):escapeHTML(row[col.key]??'—')}</td>`).join('')}<td><div class="actions"><button class="button edit-record" data-id="${row[config.idKey]}">Edit</button><button class="button danger delete-record" data-id="${row[config.idKey]}">Delete</button></div></td></tr>`).join(''):`<tr><td colspan="${config.columns.length+1}" class="empty">No records found.</td></tr>`;};
  const load=async()=>{records=await api(config.endpoint);draw();};
  const show=(row=null)=>{editing=row;document.getElementById('form-heading').textContent=row?'Edit record':'Add record';config.fields.forEach(field=>{const input=form.elements[field.name];if(input)input.value=row?.[field.name]??field.value??'';});card.classList.remove('hidden');card.scrollIntoView({behavior:'smooth',block:'start'});};
  document.getElementById('add-record').addEventListener('click',()=>show());document.getElementById('cancel-form').addEventListener('click',()=>card.classList.add('hidden'));
  form.addEventListener('submit',async event=>{event.preventDefault();const body=Object.fromEntries(new FormData(form).entries());for(const field of config.fields)if(field.type==='number'&&body[field.name]!=='' )body[field.name]=Number(body[field.name]);try{await api(editing?`${config.endpoint}/${editing[config.idKey]}`:config.endpoint,{method:editing?'PUT':'POST',body:JSON.stringify(body)});toast(editing?'Record updated':'Record created');card.classList.add('hidden');form.reset();await load();}catch(error){document.getElementById('record-error').textContent=error.message;}});
  root.addEventListener('click',async event=>{const edit=event.target.closest('.edit-record'),del=event.target.closest('.delete-record');if(edit){const id=Number(edit.dataset.id);show(records.find(r=>r[config.idKey]===id));}if(del){if(!confirm('Delete this record? Related records may also be deleted.'))return;try{await api(`${config.endpoint}/${del.dataset.id}`,{method:'DELETE'});toast('Record deleted');await load();}catch(error){toast(error.message,true);}}});
  document.getElementById('table-search').addEventListener('input',event=>{const q=event.target.value.toLowerCase();draw(records.filter(row=>Object.values(row).some(value=>String(value??'').toLowerCase().includes(q))));});
  try{await load()}catch(error){toast(error.message,true);document.getElementById('records-body').innerHTML=`<tr><td colspan="${config.columns.length+1}" class="empty">${escapeHTML(error.message)}</td></tr>`;}
}


document.addEventListener('DOMContentLoaded', () => {
  const page = document.getElementById('page-content')?.dataset.page;
  const modules = {
    milestones: { endpoint:'/milestones', idKey:'milestone_id', title:'Milestone tracker', fields:[{name:'project_id',label:'Project ID',type:'number',required:true},{name:'name',label:'Milestone name',required:true},{name:'planned_date',label:'Planned date',type:'date',required:true},{name:'status',label:'Status',type:'select',options:['Pending','In Progress','Completed','Delayed']},{name:'description',label:'Description',type:'textarea'}], columns:[{key:'name',label:'Milestone'},{key:'project_name',label:'Project'},{key:'planned_date',label:'Planned date',format:dateLabel},{key:'status',label:'Status',format:statusTag}] },
    progress: { endpoint:'/progress', idKey:'update_id', title:'Construction progress updates', fields:[{name:'project_id',label:'Project ID',type:'number',required:true},{name:'update_date',label:'Update date',type:'date',required:true},{name:'progress_percent',label:'Overall progress (%)',type:'number'},{name:'description',label:'Update description',type:'textarea',required:true},{name:'completed_work',label:'Completed work',type:'textarea'},{name:'remarks',label:'Remarks',type:'textarea'}], columns:[{key:'project_name',label:'Project'},{key:'update_date',label:'Date',format:dateLabel},{key:'progress_percent',label:'Progress',format:v=>`${Number(v||0)}%`},{key:'description',label:'Description'},{key:'completed_work',label:'Completed work'}] },
    expenses: { endpoint:'/expenses', idKey:'cost_id', title:'Project expenses', fields:[{name:'project_id',label:'Project ID',type:'number',required:true},{name:'amount',label:'Amount (INR)',type:'number',required:true},{name:'category',label:'Category',required:true},{name:'expense_date',label:'Expense date',type:'date',required:true},{name:'description',label:'Description',type:'textarea'}], columns:[{key:'project_name',label:'Project'},{key:'amount',label:'Amount',format:money},{key:'category',label:'Category'},{key:'expense_date',label:'Date',format:dateLabel},{key:'description',label:'Description'}] },
    risks: { endpoint:'/risks', idKey:'risk_id', title:'Project risk register', fields:[{name:'project_id',label:'Project ID',type:'number',required:true},{name:'type',label:'Risk type',required:true},{name:'severity',label:'Severity',type:'select',options:['Low','Medium','High','Critical']},{name:'status',label:'Status',type:'select',options:['Open','Monitoring','Mitigated','Closed']},{name:'description',label:'Risk description',type:'textarea',required:true}], columns:[{key:'project_name',label:'Project'},{key:'type',label:'Risk type'},{key:'severity',label:'Severity',format:statusTag},{key:'description',label:'Description'},{key:'status',label:'Status',format:statusTag}] }
  };
  if (modules[page]) renderCrudPage(modules[page]);
});

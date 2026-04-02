import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service.ts';
import { CardComponent, ButtonComponent, TagComponent } from '@dezkareid/components/angular';

@Component({
  selector: 'app-url-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, TagComponent],
  template: `
    <div class="url-management">
      <header class="header">
        <h1>URL Management</h1>
      </header>

      <div class="grid">
        <section class="section">
          <div db-card>
            <h2>Add Domain</h2>
            <form [formGroup]="domainForm" (ngSubmit)="addDomain()" class="form">
              <div class="form-field">
                <label for="domain-name">Name</label>
                <input id="domain-name" formControlName="name" placeholder="e.g. Main Website" />
              </div>
              <div class="form-field">
                <label for="domain-desc">Description</label>
                <input id="domain-desc" formControlName="description" placeholder="Optional" />
              </div>
              <button db-button type="submit" [disabled]="domainForm.invalid">Add Domain</button>
            </form>
          </div>

          <div db-card class="mt-24">
            <h2>Domains</h2>
            <ul class="list">
              <li *ngFor="let domain of api.domains()">
                <strong>{{ domain.name }}</strong>
                <p class="text-secondary">{{ domain.description }}</p>
              </li>
            </ul>
          </div>
        </section>

        <section class="section">
          <div db-card>
            <h2>Add Environment</h2>
            <form [formGroup]="envForm" (ngSubmit)="addEnvironment()" class="form">
              <div class="form-field">
                <label for="env-name">Name</label>
                <input id="env-name" formControlName="name" placeholder="e.g. Production" />
              </div>
              <div class="form-field">
                <label for="env-prefix">URL Prefix</label>
                <input id="env-prefix" formControlName="urlPrefix" placeholder="e.g. https://dezkareid.dev" />
              </div>
              <button db-button type="submit" [disabled]="envForm.invalid">Add Environment</button>
            </form>
          </div>

          <div db-card class="mt-24">
            <h2>Environments</h2>
            <ul class="list">
              <li *ngFor="let env of api.environments()">
                <span db-tag variant="success">{{ env.name }}</span>
                <span class="ml-8 text-secondary">{{ env.urlPrefix }}</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="section full-width">
          <div db-card>
            <h2>Add URL</h2>
            <form [formGroup]="urlForm" (ngSubmit)="addUrl()" class="form horizontal">
              <div class="form-field">
                <label for="url-address">Address (Path)</label>
                <input id="url-address" formControlName="address" placeholder="e.g. /about or https://google.com" />
              </div>
              <div class="form-field">
                <label for="url-domain">Domain</label>
                <select id="url-domain" formControlName="domainId">
                  <option value="">Select Domain</option>
                  <option *ngFor="let domain of api.domains()" [value]="domain.id">{{ domain.name }}</option>
                </select>
              </div>
              <button db-button type="submit" [disabled]="urlForm.invalid" class="align-bottom">Add URL</button>
            </form>
          </div>

          <div db-card class="mt-24">
            <h2>URLs</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Domain</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let url of api.urls()">
                  <td>{{ url.address }}</td>
                  <td>{{ url.domain?.name }}</td>
                  <td>
                    <div class="flex gap-8">
                      <button 
                        db-button
                        *ngFor="let env of api.environments()" 
                        size="sm" 
                        variant="secondary"
                        (click)="triggerAudit(url.id, env.id)"
                      >
                        Audit {{ env.name }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .url-management {
      padding: var(--spacing-24);
    }
    .header {
      margin-bottom: var(--spacing-32);
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-24);
    }
    .full-width {
      grid-column: span 2;
    }
    .mt-24 {
      margin-top: var(--spacing-24);
    }
    .ml-8 {
      margin-left: var(--spacing-8);
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-16);
    }
    .form.horizontal {
      flex-direction: row;
      align-items: flex-end;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      flex: 1;
    }
    label {
      font-size: var(--font-size-200);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
    }
    input, select {
      padding: var(--spacing-8) var(--spacing-12);
      border-radius: var(--border-radius-small);
      border: 1px solid var(--color-background-secondary);
      background-color: var(--color-background-primary);
      color: var(--color-text-primary);
    }
    .list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .list li {
      padding: var(--spacing-12) 0;
      border-bottom: 1px solid var(--color-background-primary);
    }
    .list li:last-child {
      border-bottom: none;
    }
    .text-secondary {
      color: var(--color-text-secondary);
      font-size: var(--font-size-200);
      margin: 0;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--spacing-16);
    }
    .table th {
      text-align: left;
      padding: var(--spacing-12);
      border-bottom: 2px solid var(--color-background-primary);
      color: var(--color-text-secondary);
      font-size: var(--font-size-200);
    }
    .table td {
      padding: var(--spacing-12);
      border-bottom: 1px solid var(--color-background-primary);
    }
    .flex { display: flex; }
    .gap-8 { gap: var(--spacing-8); }
    .align-bottom { align-self: flex-end; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlManagementComponent implements OnInit {
  api = inject(ApiService);
  private fb = inject(FormBuilder);

  domainForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  envForm = this.fb.group({
    name: ['', Validators.required],
    urlPrefix: [''],
  });

  urlForm = this.fb.group({
    address: ['', Validators.required],
    domainId: ['', Validators.required],
  });

  ngOnInit() {
    this.api.loadDomains();
    this.api.loadEnvironments();
    this.api.loadUrls();
  }

  async addDomain() {
    if (this.domainForm.valid) {
      await this.api.createDomain(this.domainForm.value);
      this.domainForm.reset();
    }
  }

  async addEnvironment() {
    if (this.envForm.valid) {
      await this.api.createEnvironment(this.envForm.value);
      this.envForm.reset();
    }
  }

  async addUrl() {
    if (this.urlForm.valid) {
      await this.api.createUrl(this.urlForm.value);
      this.urlForm.reset();
    }
  }

  async triggerAudit(urlId: string, environmentId: string) {
    await this.api.triggerAudit(urlId, environmentId);
    alert('Audit triggered!');
  }
}

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Domain {
  id: string;
  name: string;
  description?: string;
  urls?: Url[];
}

export interface Url {
  id: string;
  address: string;
  description?: string;
  domainId: string;
  domain?: Domain;
}

export interface Environment {
  id: string;
  name: string;
  urlPrefix?: string;
  description?: string;
}

export interface AuditRun {
  id: string;
  urlId: string;
  environmentId: string;
  status: string;
  inBudget: boolean;
  metrics?: any[];
  startedAt?: string;
  completedAt?: string;
  url?: Url;
  environment?: Environment;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000'; // Default NestJS port

  // State using Signals
  domains = signal<Domain[]>([]);
  environments = signal<Environment[]>([]);
  urls = signal<Url[]>([]);
  auditRuns = signal<AuditRun[]>([]);

  async loadDomains() {
    const data = await firstValueFrom(this.http.get<Domain[]>(`${this.baseUrl}/domains`));
    this.domains.set(data);
  }

  async loadEnvironments() {
    const data = await firstValueFrom(this.http.get<Environment[]>(`${this.baseUrl}/environments`));
    this.environments.set(data);
  }

  async loadUrls() {
    const data = await firstValueFrom(this.http.get<Url[]>(`${this.baseUrl}/urls`));
    this.urls.set(data);
  }

  async loadAuditRuns() {
    const data = await firstValueFrom(this.http.get<AuditRun[]>(`${this.baseUrl}/audit/runs`));
    this.auditRuns.set(data);
  }

  async triggerAudit(urlId: string, environmentId: string) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/audit/trigger`, { urlId, environmentId }));
  }

  async createDomain(data: any) {
    const res = await firstValueFrom(this.http.post<Domain>(`${this.baseUrl}/domains`, data));
    this.domains.update(prev => [...prev, res]);
    return res;
  }

  async createEnvironment(data: any) {
    const res = await firstValueFrom(this.http.post<Environment>(`${this.baseUrl}/environments`, data));
    this.environments.update(prev => [...prev, res]);
    return res;
  }

  async createUrl(data: any) {
    const res = await firstValueFrom(this.http.post<Url>(`${this.baseUrl}/urls`, data));
    this.urls.update(prev => [...prev, res]);
    return res;
  }
}

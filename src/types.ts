export type DeploymentStatus = 'AWAITING_INPUT' | 'PREPARING' | 'BUILDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';

export interface DeploymentConfig {
  repoUrl: string;
  ref: string;
  imageName: string;
  imageTag: string;
  port: number;
  envVars: Array<{ key: string; value: string }>;
  enableHealthCheck: boolean;
  healthEndpoint: string;
}

export interface VerificationCheck {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
}

export interface DeploymentLog {
  id: string;
  timestamp: string;
  stage: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

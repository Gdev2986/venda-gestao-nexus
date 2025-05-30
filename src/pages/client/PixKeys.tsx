
import React from 'react';
import { PageHeader } from '@/components/page/PageHeader';
import { ClientPixKeysManager } from '@/components/settings/ClientPixKeysManager';

const ClientPixKeys = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Chaves PIX"
        description="Gerencie suas chaves PIX para recebimento de pagamentos"
      />
      <ClientPixKeysManager />
    </div>
  );
};

export default ClientPixKeys;

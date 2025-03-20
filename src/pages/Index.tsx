
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import MainLayout from '@/components/layout/MainLayout';
import PromotionCard from '@/components/dashboard/PromotionCard';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';
import TenantDashboard from '@/components/dashboard/TenantDashboard';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { userRole } = useAuth();
  
  return (
    <MainLayout>
      <PageTransition>
        <div className="page-container pb-16">
          {/* Promotion Card - Only show for both user types */}
          <PromotionCard />

          {/* Conditional Dashboard based on user role */}
          {userRole === 'proprietaire' ? <OwnerDashboard /> : <TenantDashboard />}
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

import React from 'react';
import { useRouter } from 'next/router';
import { Categories, Products } from 'components/admin';
import { useAuth } from 'contexts';
import { Alert } from 'components/ui';

const Manage: React.FC = () => {
  const { currentUser } = useAuth();
  const { query } = useRouter();
  const selectedPage = query.selected_page || 'products';

  const renderSection = () => {
    switch (selectedPage) {
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'author':
        return <Products />;
      case 'publisher':
        return <Products />;
      default:
        return null;
    }
  };

  if (currentUser?.role !== 'admin') {
    return <Alert message="Bạn không có quyền truy cập trang này" type="error" />;
  }

  return (
    <>
      <div>{renderSection()}</div>
    </>
  );
};

export default Manage;

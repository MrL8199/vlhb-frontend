import React, { useState, useEffect } from 'react';
import { Category, AddCategory as AddCategoryType } from 'types';
import { CategoryService } from 'services';
import { ErrorMessage, Pagination, Spinner, Button, Modal } from 'components/ui';
import { FaTrash } from 'react-icons/fa';
import { formatPrice } from 'utils/helpers';
import { useToast } from 'contexts';
import styles from './Category.module.css';
import AddProduct from '../AddProduct';

const LIMIT = 10;

const Categories: React.FC = () => {
  const { setToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpenAddProductModal, setIsOpenAddProductModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const results = await CategoryService.getCategories();
        setCategories(results.categories);
        setTotal(results.total);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [page]);

  const onChangePaginate = (val: number) => {
    setPage(val);
  };

  const closeAddProductModal = () => {
    setIsOpenAddProductModal(false);
  };

  const openAddProductModal = () => {
    setIsOpenAddProductModal(true);
  };

  const handleAddProduct = async (newProduct: AddCategoryType) => {
    try {
      const { product } = await CategoryService.addCategory(newProduct);
      setCategories([product, ...categories]);
    } catch (error) {
      setToast('error', error.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const isConfirm = window.confirm('Are you sure you want to delete this product?');
      if (!isConfirm) return;
      await CategoryService.deleteProduct(id);
      const filterProducts = categories.filter((product) => product.id !== id);
      setCategories(filterProducts);
      setToast('success', 'Successfully deleted');
    } catch (error) {
      setToast('error', error.message);
    }
  };

  if (loading) {
    return <Spinner size={60} />;
  }

  if (error) {
    return <ErrorMessage message="Unable to get categories right now please try again later." />;
  }

  return (
    <div className="table-container">
      <Modal visible={isOpenAddProductModal} title="Add Product" onClose={closeAddProductModal}>
        <AddProduct onSubmit={handleAddProduct} />
      </Modal>
      <div className={styles.addProductContainer}>
        <Button title="Thêm" onClick={openAddProductModal} />
      </div>
      {categories.length === 0 ? (
        <div className={styles.msg}> No categories created yet. </div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '30rem' }}> Product </th>
                <th> Price </th>
                <th style={{ width: '20rem' }}> Description </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((product) => (
                <tr key={product.id}>
                  <td>
                    <a href={`/product?id=${product.id}`} target="_blank" rel="noreferrer">
                      <div className={styles.productInfo}>
                        <img src={product.images[0]} alt={product.title} />
                        <div className={styles.name}> {product.title} </div>
                      </div>
                    </a>
                  </td>
                  <td>
                    <div className={styles.price}>{formatPrice(product.price)}</div>
                  </td>
                  <td>
                    <div className={styles.desc}>{product.quotes_about}</div>
                  </td>
                  <td>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination limit={LIMIT} onChange={onChangePaginate} total={total} active={page} />
        </>
      )}
    </div>
  );
};

export default Categories;

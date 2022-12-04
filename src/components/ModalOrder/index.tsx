import styles from './style.module.scss';
import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';

import { OrderItemProps } from '../../pages/dashboard';

interface ModalOrderProps {
    isOpen: boolean;
    onRequestClose: () => void;
    handleFinishOrder: (id: string) => void;
    order: OrderItemProps[];
}

export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {


    const price = order.map(item => {
        return parseInt(item.Product.price) * item.amount;
    });


    const total = price.reduce((acc, obj) => {
        return acc + obj;
    });


    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1D1D2E'
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >

            <button
                type='button'
                onClick={onRequestClose}
                className="react-modal-close"
                style={{ background: 'transparent', border: 0 }}
            >
                <FiX size={45} color="#F34748" />
            </button>

            <div className={styles.container}>
                <h2>Detalhes do pedido</h2>
                <span className={styles.table}>
                    Mesa: {order[0].order.table}
                </span>

                {order.map(item => (
                    <section key={item.id} className={styles.containerItem}>
                        <div className={styles.itemContent}>
                            <span> {item.amount} - <strong>{item.Product.name}</strong> </span>
                            <span className={styles.price}>R${(item.Product.price) * (item.amount)}  </span>
                        </div>
                        <span className={styles.description}>{item.Product.description} </span>
                    </section>
                ))}

                <span className={styles.total}>
                    Total: R$ {total.toFixed(2)}
                </span>

                <div className={styles.containerButton}>
                    <button className={styles.buttonOrder} onClick={() => { handleFinishOrder(order[0].order_id) }}>
                        Concluir Pedido
                    </button>

                </div>

            </div>

        </Modal >
    )
}
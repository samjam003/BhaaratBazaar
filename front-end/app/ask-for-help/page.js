'use client'
import React, { useState } from 'react'
import ReplyButton from './ReplyButton';
import { Modal } from '@/components/Modal';

const page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleReply = () => {
        console.log('ehlo')
    }
    return (
        <div>
            <div>
                i want to open samosa cart in airoli.
                <button onClick={handleReply}>reply</button>
                {/* <ReplyButton handleReply={handleReply} /> */}
            </div>
            <div>
                i want to open coffee/tea stall in airoli
                {/* <ReplyButton handleReply={handleReply} /> */}
                <button onClick={handleReply}>reply</button>


            </div>
            <div>
                i want to invest in stock
                {/* <ReplyButton handleReply={handleReply} /> */}
                <button onClick={handleReply}>reply</button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    )
}

export default page

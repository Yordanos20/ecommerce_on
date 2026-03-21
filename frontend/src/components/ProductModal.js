// src/components/ProductModal.js
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";

export default function ProductModal({ isOpen, closeModal, onSubmit, initialData }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || { name: "", price: "", stock: 0, isNew: false, isSale: false },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">{initialData ? "Edit Product" : "Add Product"}</Dialog.Title>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3">
            <input {...register("name")} placeholder="Product Name" className="input input-bordered w-full" />
            <input {...register("price")} placeholder="Price" type="number" className="input input-bordered w-full" />
            <input {...register("stock")} placeholder="Stock" type="number" className="input input-bordered w-full" />
            <input {...register("image")} placeholder="Image URL" className="input input-bordered w-full" />
            <div className="flex gap-2 items-center">
              <label>New</label>
              <input type="checkbox" {...register("isNew")} />
              <label>Sale</label>
              <input type="checkbox" {...register("isSale")} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary">{initialData ? "Update" : "Add"}</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
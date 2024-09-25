import { ReactNode } from "react";

export default function Modal(props: {
  modal_id: string;
  children: ReactNode;
}) {
  const { modal_id, children } = props;
  return (
    <dialog id={modal_id} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
}

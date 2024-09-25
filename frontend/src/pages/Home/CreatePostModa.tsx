import CreatePost from "../../components/CreatePost";
import Modal from "../../components/UI/Modal";

export default function CreatePostModal() {
  return (
    <Modal modal_id="create_post_modal">
      <CreatePost />
    </Modal>
  );
}

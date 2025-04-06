import RoomForm from '../components/chat/RoomForm';
import Layout from '../components/layout/Layout';
import Sidebar from '../components/layout/Sidebar';

const NewRoomPage = () => {
  return (
    <Layout>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <RoomForm />
        </div>
      </div>
    </Layout>
  );
};

export default NewRoomPage;
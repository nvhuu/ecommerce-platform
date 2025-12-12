"use client";

import api from "@/lib/api";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  FileOutlined,
  FolderAddOutlined,
  FolderOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Typography,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { Dragger } = Upload;

import { ElementType } from "react";

// Cast Card to ElementType to fix React 19 / Antd 6 type mismatch
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const MediaCard = Card as ElementType;
const { Meta } = Card;

interface MediaFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

interface MediaFolder {
  id: string;
  name: string;
}

export default function MediaPage() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "Home" },
  ]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const fetchMedia = async (folderId: string | null) => {
    setLoading(true);
    try {
      const response = await api.get("/media", {
        params: { folderId },
      });
      setFiles(response.data.files);
      setFolders(response.data.folders);
    } catch (error) {
      console.error(error);
      message.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(currentFolderId);
  }, [currentFolderId]);

  const handleFolderClick = (folder: MediaFolder) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolderId(newBreadcrumbs[index].id);
  };

  const handleDelete = async (id: string, type: "file" | "folder") => {
    Modal.confirm({
      title: `Delete ${type}?`,
      content: "Are you sure you want to delete this item? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await api.delete(`/media/${type}/${id}`);
          message.success("Deleted successfully");
          fetchMedia(currentFolderId);
        } catch (error) {
          message.error("Failed to delete item. Ensure folder is empty.");
        }
      },
    });
  };

  const handleCreateFolder = async (values: { name: string }) => {
    try {
      await api.post("/media/folder", {
        name: values.name,
        parentId: currentFolderId,
      });
      message.success("Folder created");
      setIsFolderModalOpen(false);
      form.resetFields();
      fetchMedia(currentFolderId);
    } catch (error) {
      message.error("Failed to create folder");
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    uploadFileList.forEach((file) => {
      formData.append("file", file.originFileObj as Blob);
    });
    if (currentFolderId) {
      formData.append("folderId", currentFolderId);
    }

    try {
      await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Files uploaded successfully");
      setIsUploadModalOpen(false);
      setUploadFileList([]);
      fetchMedia(currentFolderId);
    } catch (error) {
      message.error("Upload failed");
    }
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = uploadFileList.indexOf(file);
      const newFileList = uploadFileList.slice();
      newFileList.splice(index, 1);
      setUploadFileList(newFileList);
    },
    beforeUpload: (file: UploadFile) => {
      setUploadFileList([...uploadFileList, file]);
      return false;
    },
    fileList: uploadFileList,
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <Title level={2}>Media Manager</Title>
        <div className='space-x-2'>
          <Button icon={<FolderAddOutlined />} onClick={() => setIsFolderModalOpen(true)}>
            New Folder
          </Button>
          <Button
            type='primary'
            icon={<CloudUploadOutlined />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload
          </Button>
        </div>
      </div>

      <Breadcrumb className='mb-6'>
        {breadcrumbs.map((item, index) => (
          <Breadcrumb.Item key={item.id || "root"} onClick={() => handleBreadcrumbClick(index)}>
            <a className='cursor-pointer text-blue-600 hover:underline'>
              {index === 0 ? <HomeOutlined /> : null} {item.name}
            </a>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>

      {loading ? (
        <div className='flex justify-center p-12'>
          <Spin size='large' />
        </div>
      ) : (
        <>
          {folders.length === 0 && files.length === 0 ? (
            <Empty description='No files or folders found' />
          ) : (
            <Row gutter={[16, 16]}>
              {folders.map((folder) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={folder.id}>
                  <MediaCard
                    hoverable
                    className='text-center'
                    onDoubleClick={() => handleFolderClick(folder)}
                    actions={[
                      <DeleteOutlined
                        key='delete'
                        className='text-red-500'
                        onClick={() => handleDelete(folder.id, "folder")}
                      />,
                    ]}
                  >
                    <FolderOutlined style={{ fontSize: "48px", color: "#faad14" }} />
                    <div className='mt-2 truncate font-medium'>{folder.name}</div>
                  </MediaCard>
                </Col>
              ))}
              {files.map((file) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={file.id}>
                  <MediaCard
                    hoverable
                    cover={
                      file.fileType.startsWith("image/") ? (
                        <img alt={file.fileName} src={file.fileUrl} className='h-32 object-cover' />
                      ) : (
                        <div className='h-32 flex items-center justify-center bg-gray-100'>
                          <FileOutlined style={{ fontSize: "48px" }} />
                        </div>
                      )
                    }
                    actions={[
                      <DeleteOutlined
                        key='delete'
                        className='text-red-500'
                        onClick={() => handleDelete(file.id, "file")}
                      />,
                    ]}
                  >
                    <Meta
                      title={file.fileName}
                      description={(file.fileSize / 1024).toFixed(2) + " KB"}
                    />
                  </MediaCard>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Upload Modal */}
      <Modal
        title='Upload Files'
        open={isUploadModalOpen}
        onOk={handleUpload}
        onCancel={() => setIsUploadModalOpen(false)}
        okText='Upload'
        confirmLoading={loading}
      >
        <Dragger {...uploadProps} multiple>
          <p className='ant-upload-drag-icon'>
            <CloudUploadOutlined />
          </p>
          <p className='ant-upload-text'>Click or drag file to this area to upload</p>
        </Dragger>
      </Modal>

      {/* Create Folder Modal */}
      <Modal
        title='Create New Folder'
        open={isFolderModalOpen}
        onOk={form.submit}
        onCancel={() => setIsFolderModalOpen(false)}
        okText='Create'
      >
        <Form form={form} onFinish={handleCreateFolder} layout='vertical'>
          <Form.Item
            name='name'
            label='Folder Name'
            rules={[{ required: true, message: "Please enter folder name" }]}
          >
            <Input placeholder='Enter folder name' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

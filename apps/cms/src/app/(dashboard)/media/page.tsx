"use client";

import type { MediaFile, MediaFolder } from "@/domain/entities/media.entity";
import {
  useCreateFolder,
  useDeleteFile,
  useDeleteFolder,
  useMedia,
  useUploadFile,
} from "@/presentation/hooks/useMedia";
import { FolderAddOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, Card, Input, message, Modal, Space, Table, Typography, Upload } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function MediaPage() {
  const [currentFolder, setCurrentFolder] = useState<string | undefined>();
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const { data, isLoading } = useMedia(currentFolder);
  const uploadFileMutation = useUploadFile();
  const createFolderMutation = useCreateFolder();
  const deleteFileMutation = useDeleteFile();
  const deleteFolderMutation = useDeleteFolder();

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await uploadFileMutation.mutateAsync({
          file: file as File,
          folderId: currentFolder,
        });
        message.success(`${(file as File).name} uploaded successfully`);
        onSuccess?.(file);
      } catch (error: any) {
        message.error(`${(file as File).name} upload failed: ${error.message}`);
        onError?.(error);
      }
    },
    showUploadList: false,
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      message.error("Please enter folder name");
      return;
    }

    try {
      await createFolderMutation.mutateAsync({
        name: newFolderName,
        parentId: currentFolder || null,
      });
      message.success("Folder created successfully");
      setIsCreateFolderModalOpen(false);
      setNewFolderName("");
    } catch (error: any) {
      message.error(error.message || "Failed to create folder");
    }
  };

  const handleDeleteFile = (id: string, filename: string) => {
    Modal.confirm({
      title: "Delete File",
      content: `Are you sure you want to delete "${filename}"?`,
      onOk: async () => {
        try {
          await deleteFileMutation.mutateAsync(id);
          message.success("File deleted successfully");
        } catch (error: any) {
          message.error(error.message || "Failed to delete file");
        }
      },
    });
  };

  const handleDeleteFolder = (id: string, folderName: string) => {
    Modal.confirm({
      title: "Delete Folder",
      content: `Are you sure you want to delete "${folderName}" and all its contents?`,
      onOk: async () => {
        try {
          await deleteFolderMutation.mutateAsync(id);
          message.success("Folder deleted successfully");
        } catch (error: any) {
          message.error(error.message || "Failed to delete folder");
        }
      },
    });
  };

  const folderColumns = [
    {
      title: "Folder Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: MediaFolder) => (
        <div
          className='flex items-center cursor-pointer hover:text-blue-600'
          onClick={() => setCurrentFolder(record.id)}
        >
          <FolderAddOutlined className='mr-2 text-lg text-yellow-600' />
          <span className='font-medium'>{text}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MediaFolder) => (
        <Button size='small' danger onClick={() => handleDeleteFolder(record.id, record.name)}>
          Delete
        </Button>
      ),
    },
  ];

  const fileColumns = [
    {
      title: "Preview",
      dataIndex: "url",
      key: "preview",
      render: (url: string, record: MediaFile) => {
        if (record.mimeType?.startsWith("image/")) {
          return (
            <img
              src={url}
              alt={record.filename}
              className='w-16 h-16 object-cover rounded border'
            />
          );
        }
        return <InboxOutlined className='text-2xl text-gray-400' />;
      },
    },
    {
      title: "Filename",
      dataIndex: "filename",
      key: "filename",
      render: (text: string) => <span className='font-medium'>{text}</span>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size: number) => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    {
      title: "Type",
      dataIndex: "mimeType",
      key: "mimeType",
      render: (type: string) => <Text type='secondary'>{type}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MediaFile) => (
        <Space>
          <Button size='small' onClick={() => window.open(record.url, "_blank")}>
            View
          </Button>
          <Button size='small' danger onClick={() => handleDeleteFile(record.id, record.filename)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='p-6 max-w-[1600px] mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Media Library
          </Title>
          <p className='text-gray-500 mt-1'>Manage your files and folders</p>
        </div>
        <Space>
          <Button
            icon={<FolderAddOutlined />}
            onClick={() => setIsCreateFolderModalOpen(true)}
            size='large'
          >
            New Folder
          </Button>
          <Upload {...uploadProps}>
            <Button type='primary' icon={<UploadOutlined />} size='large'>
              Upload Files
            </Button>
          </Upload>
        </Space>
      </div>

      {currentFolder && (
        <div className='mb-4'>
          <Button onClick={() => setCurrentFolder(undefined)}>← Back to Root</Button>
        </div>
      )}

      <Card className='mb-4'>
        <Title level={4}>Folders</Title>
        <Table
          columns={folderColumns}
          dataSource={data?.folders || []}
          rowKey='id'
          loading={isLoading}
          pagination={false}
          locale={{ emptyText: "No folders" }}
        />
      </Card>

      <Card>
        <Title level={4}>Files</Title>
        <div className='mb-4'>
          <Dragger {...uploadProps} style={{ padding: "20px" }}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
            <p className='ant-upload-hint'>
              Support for single or bulk upload. Strictly prohibit from uploading company data or
              other banned files.
            </p>
          </Dragger>
        </div>

        <Table
          columns={fileColumns}
          dataSource={data?.files || []}
          rowKey='id'
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No files" }}
        />
      </Card>

      <Modal
        title='Create New Folder'
        open={isCreateFolderModalOpen}
        onCancel={() => {
          setIsCreateFolderModalOpen(false);
          setNewFolderName("");
        }}
        onOk={handleCreateFolder}
        confirmLoading={createFolderMutation.isPending}
      >
        <Input
          placeholder='Folder name'
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onPressEnter={handleCreateFolder}
          autoFocus
        />
      </Modal>
    </div>
  );
}

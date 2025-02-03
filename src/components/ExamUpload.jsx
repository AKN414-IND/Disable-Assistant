import React, { useEffect, useState } from 'react';
import { database } from '../Firebase';
import { ref, push, onValue, remove, set } from 'firebase/database';
import { Button, Input, Form, Select, List, Popconfirm, Modal } from 'antd';
import './ExamUpload.css';

const { Option } = Select;

const ExamUpload = () => {
  const [exams, setExams] = useState([]);
  const [editingExamId, setEditingExamId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mainForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchExams = () => {
    const examsRef = ref(database, 'exams');
    onValue(examsRef, (snapshot) => {
      const examsData = snapshot.val();
      const examsArray = [];

      if (examsData) {
        for (let id in examsData) {
          examsArray.push({ id, ...examsData[id] });
        }
      }
      setExams(examsArray);
    });
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleUpload = () => {
    setFormSubmitted(true);
    
    mainForm.validateFields()
      .then((values) => {
        const examRef = ref(database, 'exams');
        push(examRef, {
          title: values.title,
          link: values.link,
          class: values.class,
        })
          .then(() => {
            alert('Google Form link uploaded successfully');
            mainForm.resetFields();
            setFormSubmitted(false);
          })
          .catch((error) => {
            console.error('Error uploading form link:', error);
            alert('Failed to upload Google Form link');
          });
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const showEditModal = (exam) => {
    setEditingExamId(exam.id);
    editForm.setFieldsValue({
      editTitle: exam.title,
      editLink: exam.link,
      editClass: exam.class,
    });
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingExamId(null);
    editForm.resetFields();
  };

  const handleModalUpdate = () => {
    editForm.validateFields()
      .then((values) => {
        const examRef = ref(database, `exams/${editingExamId}`);
        set(examRef, {
          title: values.editTitle,
          link: values.editLink,
          class: values.editClass,
        })
          .then(() => {
            alert('Google Form link updated successfully');
            handleModalCancel();
          })
          .catch((error) => {
            console.error('Error updating form link:', error);
            alert('Failed to update Google Form link');
          });
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const handleDelete = (examId) => {
    const examRef = ref(database, `exams/${examId}`);
    remove(examRef)
      .then(() => {
        alert('Google Form link deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting form link:', error);
        alert('Failed to delete Google Form link');
      });
  };

  return (
    <div className="exam-upload-container">
      <h1>Upload Google Form</h1>
      <Form
        form={mainForm}
        layout="vertical"
        className="exam-upload-form"
      >
        <Form.Item
          label="Form Title"
          name="title"
          rules={[
            { 
              required: true, 
              message: 'Please enter the title',
            }
          ]}
          validateStatus={formSubmitted && !mainForm.getFieldValue('title') ? 'error' : ''}
        >
          <Input placeholder="Enter the title for the Google Form" />
        </Form.Item>
        <Form.Item
          label="Google Form Link"
          name="link"
          rules={[
            { 
              required: true, 
              message: 'Please enter the Google Form link',
            }
          ]}
          validateStatus={formSubmitted && !mainForm.getFieldValue('link') ? 'error' : ''}
        >
          <Input placeholder="Enter Google Form link" />
        </Form.Item>
        <Form.Item
          label="Select Class"
          name="class"
          rules={[
            { 
              required: true, 
              message: 'Please select a class',
            }
          ]}
          validateStatus={formSubmitted && !mainForm.getFieldValue('class') ? 'error' : ''}
        >
          <Select placeholder="Select a class">
            <Option value="Class 1">Class 1</Option>
            <Option value="Class 2">Class 2</Option>
            <Option value="Class 3">Class 3</Option>
            <Option value="Class 4">Class 4</Option>
            <Option value="Class 5">Class 5</Option>
            <Option value="Class 6">Class 6</Option>
              <Option value="Class 7">Class 7</Option>
              <Option value="Class 8">Class 8</Option>
              <Option value="Class 9">Class 9</Option>
              <Option value="Class 10">Class 10</Option>
              <Option value="Class 11">Class 11</Option>
              <Option value="Class 12">Class 12</Option>

          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleUpload}>
            Upload Form
          </Button>
        </Form.Item>
      </Form>

      <h2>Uploaded Exams</h2>
      <List
        bordered
        dataSource={exams}
        renderItem={(exam) => (
          <List.Item
            actions={[
              <Button onClick={() => showEditModal(exam)}>Edit</Button>,
              <Popconfirm
                title="Are you sure you want to delete this exam?"
                onConfirm={() => handleDelete(exam.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            ]}
          >
            <div>
              <h3>{exam.title}</h3>
              <p>Class: {exam.class}</p>
              <a href={exam.link} target="_blank" rel="noopener noreferrer">
                View Exam
              </a>
            </div>
          </List.Item>
        )}
      />

      <Modal
        title="Edit Exam"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalUpdate}>
            Update
          </Button>,
        ]}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="editTitle"
            label="Form Title"
            rules={[{ required: true, message: 'Please enter the title' }]}
          >
            <Input placeholder="Enter the title for the Google Form" />
          </Form.Item>
          <Form.Item
            name="editLink"
            label="Google Form Link"
            rules={[{ required: true, message: 'Please enter the Google Form link' }]}
          >
            <Input placeholder="Enter Google Form link" />
          </Form.Item>
          <Form.Item
            name="editClass"
            label="Select Class"
            rules={[{ required: true, message: 'Please select a class' }]}
          >
            <Select placeholder="Select a class">
              <Option value="Class 1">Class 1</Option>
              <Option value="Class 2">Class 2</Option>
              <Option value="Class 3">Class 3</Option>
              <Option value="Class 4">Class 4</Option>
              <Option value="Class 5">Class 5</Option>
              <Option value="Class 6">Class 6</Option>
              <Option value="Class 7">Class 7</Option>
              <Option value="Class 8">Class 8</Option>
              <Option value="Class 9">Class 9</Option>
              <Option value="Class 10">Class 10</Option>
              <Option value="Class 11">Class 11</Option>
              <Option value="Class 12">Class 12</Option>

            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamUpload;
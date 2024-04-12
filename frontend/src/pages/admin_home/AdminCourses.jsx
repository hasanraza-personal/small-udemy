import { Box, Flex, Button, Modal, Heading, Card, useToast, CardBody, StackDivider, Text, Link, Textarea, Stack, FormControl, FormLabel, ModalOverlay, Input, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FileEarmarkPdfFill, PlusLg } from 'react-bootstrap-icons';

const AdminCourses = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const toast = useToast();
  const [credentials, setCredentials] = useState({
    coursename: "",
    coursedesc: "",
    pdf: "",
  });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const selectPDF = (e) => {
    if (e.target.files[0]) {
      setCredentials({ ...credentials, [e.target.name]: e.target.files[0] });
    }
  }

  const handleSave = async () => {
    if (credentials.coursename.trim().length === 0) {
      toast({
        position: 'top',
        title: "Please provide course name",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return
    }

    if (credentials.coursedesc.trim().length === 0) {
      toast({
        position: 'top',
        title: "Please provide coursedesc",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return
    }

    if (!credentials.pdf) {
      toast({
        position: 'top',
        title: "Please provide course PDF",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('coursename', credentials.coursename);
    formData.append('coursedesc', credentials.coursedesc);
    formData.append('pdf', credentials.pdf);

    try {
      const response = await axios({
        method: 'POST',
        url: '/courses/addcourse',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: formData
      });

      const updatedCourses = [response.data.newCourse, ...courses];
      setCourses(updatedCourses)

      toast({
        position: 'top',
        title: "New course added successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setLoading(false);
    } catch (error) {
      toast({
        position: 'top',
        title: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios({
        method: 'POST',
        url: '/courses/deletecourse',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: {
          courseid: id
        }
      });

      let updatedCourses = courses.filter((course) => course._id !== id)
      setCourses(updatedCourses);

      toast({
        position: 'top',
        title: "Course deleted successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    } catch (error) {
      toast({
        position: 'top',
        title: error.response.data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    const getAllAdminCourses = async () => {
      try {
        const response = await axios({
          method: 'GET',
          url: 'courses/showadmincourses',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        setCourses(response.data.adminCourses);
      } catch (error) {
        toast({
          position: 'top',
          title: error.response.data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    getAllAdminCourses();
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {/* Modal */}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new course</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Stack spacing='10px'>
              <FormControl>
                <FormLabel>Course name</FormLabel>
                <Input type='text' name="coursename" onChange={onChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Course description</FormLabel>
                <Textarea name="coursedesc" onChange={onChange} placeholder='Here is a sample placeholder' />
              </FormControl>
              <FormControl>
                <FormLabel>Course PDF</FormLabel>
                <Input type='file' name="pdf" onChange={selectPDF} />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSave} isLoading={loading}>
              Save
            </Button>
            <Button onClick={onClose} isLoading={loading}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal */}

      <Box mb={5}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as='h4' size='md'>
            Add New Course
          </Heading>
          {localStorage.getItem('role') === "admin" &&
            <Button rightIcon={<PlusLg />} size='sm' colorScheme='whatsapp' onClick={onOpen}>
              Add
            </Button>
          }
        </Flex>

      </Box>
      {courses.length > 0 ? <>
        {courses.map((course, id) => (
          <Card key={id} mb={5}>
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Course Name
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {course.coursename}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Auther Name
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {course.adminname}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Course Description
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {course.coursedesc}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    PDF File
                  </Heading>
                  {course.adminid === localStorage.getItem("user") ? <>
                    <Flex alignItems="center" gap={2}>
                      <FileEarmarkPdfFill />
                      <Text pt='2' fontSize='sm'>
                        <Link href={course.pdf} isExternal>
                          Click to view
                        </Link>
                      </Text>
                    </Flex>
                  </> : <>
                    <Text pt='2' fontSize='sm'>
                      Only authorized admin can see their PDF document
                    </Text>
                  </>}
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Delete this course
                  </Heading>
                  <Button isLoading={loading} colorScheme='red' size='xs' mt="2" onClick={() => handleDelete(course._id)}>Delete</Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </> : <>
        <Heading as='h4' size='md'>
          No course available!
        </Heading>
      </>}
    </>
  )


}

export default AdminCourses

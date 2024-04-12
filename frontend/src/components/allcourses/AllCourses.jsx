import { Box, useToast, Stack, Card, Link, Flex, Heading, CardBody, StackDivider, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FileEarmarkPdfFill } from 'react-bootstrap-icons';

const AllCourses = () => {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleEnroll = async (id) => {
    try {
      await axios({
        method: 'POST',
        url: '/courses/enrollcourse',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: {
          courseid: id
        }
      });

      getAllCourses();
      localStorage.getItem("role") === "student" && getStudent();

      toast({
        position: 'top',
        title: "Course enrolled successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top',
        title: error.response.data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleDisenroll = async (id) => {
    try {
      await axios({
        method: 'POST',
        url: '/courses/disenrollcourse',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: {
          courseid: id
        }
      });

      getAllCourses();
      localStorage.getItem("role") === "student" && getStudent();

      toast({
        position: 'top',
        title: "Course disenrolled successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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

  const getStudent = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'courses/getstudentenrolledcourses',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (response.data.enrolledCourses) {
        setStudentData(response.data.enrolledCourses.courses);
      }
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

  const getAllCourses = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'courses/showcourses',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      setCourses(response.data.courses);
    } catch (error) {
      toast({
        position: 'top',
        title: error.response.data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    // localStorage.getItem("role") 
    getAllCourses();
    localStorage.getItem("role") === "student" && getStudent();
    // eslint-disable-next-line
  }, [])

  if (courses.length > 0) {
    return (
      <>
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
                  {/* Show PDF to admin */}
                  {localStorage.getItem("role") === "admin" && <>
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
                  </>}

                  {/* Show PDF to student */}
                  {localStorage.getItem("role") === "student" && <>
                    {studentData.includes(course._id) ? <>
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
                        In order to view this course PDF, please enroll in this course
                      </Text>
                    </>}
                  </>}
                </Box>

                {/* Show delete option to admin */}
                {(course.adminid === localStorage.getItem("user") && localStorage.getItem("role") === "admin") &&
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      Delete this course
                    </Heading>
                    <Button isLoading={loading} colorScheme='red' size='xs' mt="2" onClick={() => handleDelete(course._id)}>Delete</Button>
                  </Box>}

                {/* Show enroll and disenroll option to student */}
                {localStorage.getItem("role") === "student" && <>
                  {studentData.includes(course._id) ? <>
                    <Box>
                      <Heading size='xs' textTransform='uppercase'>
                        Take action
                      </Heading>
                      <Button isLoading={loading} colorScheme='red' size='xs' mt="2" onClick={() => handleDisenroll(course._id)}>Disenroll From This Course</Button>
                    </Box>
                  </> : <>
                    <Box>
                      <Heading size='xs' textTransform='uppercase'>
                        Take action
                      </Heading>
                      <Button isLoading={loading} colorScheme='whatsapp' size='xs' mt="2" onClick={() => handleEnroll(course._id)}>Enroll In This Course</Button>
                    </Box>
                  </>
                  }
                </>}
              </Stack>
            </CardBody>
          </Card >
        ))}
      </>
    )
  } else {
    return (<>
      <Heading as='h4' size='md'>
        No course available!
      </Heading>
    </>)
  }

}

export default AllCourses

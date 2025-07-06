import { Button, Flex, Text } from "@chakra-ui/react";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { useSearchParams } from "react-router-dom";

export default function Pagination({ itemCount, pageSize, currentPage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Math.ceil(itemCount / pageSize);

  if (pageCount <= 1) {
    return null;
  }

  const changePage = (page) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  return (
    <Flex align="center" gap="2" mt="4" justify="center">
      <Text fontSize="sm" mr="4">
        Page {currentPage} of {pageCount}
      </Text>

      {/* First Page Button */}
      <Button
        isDisabled={currentPage === 1}
        onClick={() => changePage(1)}
        size="sm"
        variant="outline"
      >
        <BsChevronDoubleLeft />
      </Button>

      {/* Previous Page Button */}
      <Button
        isDisabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        size="sm"
        variant="outline"
      >
        <BsChevronLeft />
      </Button>

      {/* Next Page Button */}
      <Button
        isDisabled={currentPage === pageCount}
        onClick={() => changePage(currentPage + 1)}
        size="sm"
        variant="outline"
      >
        <BsChevronRight />
      </Button>

      {/* Last Page Button */}
      <Button
        isDisabled={currentPage === pageCount}
        onClick={() => changePage(pageCount)}
        size="sm"
        variant="outline"
      >
        <BsChevronDoubleRight />
      </Button>
    </Flex>
  );
}

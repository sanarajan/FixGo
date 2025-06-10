import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface EnhancedPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  color?: "primary" | "secondary" | "standard";
  size?: "small" | "medium" | "large";
  pageSize: number;
  totCount: number;
}

const EnhancedPagination: React.FC<EnhancedPaginationProps> = ({
  count,
  page,
  onChange,
  color = "primary",
  size = "medium",
  pageSize,
  totCount,
}) => {
  const [clickedPage, setClickedPage] = useState<number | null>(null);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (value >= 1 && value <= count) {
      setClickedPage(value);
      onChange(event, value);
      setTimeout(() => setClickedPage(null), 300);
    }
  };

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totCount);

  return (
    <div className="pagination-container flex items-center justify-between w-full mt-4">
      {/* Left side: Showing text */}
      {totCount ? (
        <div className="text-gray-600 text-sm font-medium bg-blue-50 px-4 py-1 rounded-full shadow-sm">
          {`Showing ${start}-${end} of ${totCount}`}
        </div>
      ) : (
        <div></div>
      )}
      {/* Right side: Pagination Buttons */}
      <div className="relative flex items-center space-x-2">
        <div
          className="rounded-full p-1 shadow-md hover:shadow-lg transition-shadow flex items-center space-x-2"
          style={{
            background: "linear-gradient(135deg, #ffff 0%, #A5A6F6 100%)",
          }}
        >
          {/* Prev Button */}
          <Button
            onClick={(e) => handlePageChange(e as any, page - 1)}
            disabled={page === 1}
            sx={{
              minWidth: "30px",
              borderRadius: "50%",
              backgroundColor: "white",
              color: "black",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            <ChevronLeft />
          </Button>

          {/* First Page */}
          <Button
            onClick={(e) => handlePageChange(e as any, 1)}
            sx={{
              minWidth: "30px",
              borderRadius: "50%",
              fontWeight: 500,
              background:
                page === 1
                  ? "linear-gradient(135deg, #7879CA 0%, #A5A6F6 100%)"
                  : "white",
              color: page === 1 ? "white" : "black",
              boxShadow:
                page === 1
                  ? "0 4px 6px -1px rgba(120, 121, 202, 0.4)"
                  : "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": {
                background:
                  page === 1
                    ? "linear-gradient(135deg, #7879CA 0%, #A5A6F6 100%)"
                    : "#e0e0e0",
              },
            }}
          >
            1
          </Button>

          {/* Left Ellipsis */}
          {page > 3 && <span className="text-gray-100 px-1">...</span>}

          {/* Current Page */}
          {page !== 1 && page !== count && (
            <Button
              onClick={(e) => handlePageChange(e as any, page)}
              sx={{
                minWidth: "30px",
                borderRadius: "50%",
                fontWeight: 500,
                background: "linear-gradient(135deg, #7879CA 0%, #A5A6F6 100%)",
                color: "white",
                boxShadow: "0 4px 6px -1px rgba(120, 121, 202, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7879CA 0%, #A5A6F6 100%)",
                },
              }}
            >
              {page}
            </Button>
          )}

          {/* Right Ellipsis */}
          {page < count - 2 && <span className="text-gray-100 px-1">...</span>}

          {/* Last Page */}
          <Button
            onClick={(e) => handlePageChange(e as any, count)}
            sx={{
              minWidth: "30px",
              borderRadius: "50%",
              fontWeight: 500,
              background:
                page === count
                  ? "linear-gradient(135deg, #7879CA 0%, #A5A6F6 100%)"
                  : "white",
              color: page === count ? "white" : "black",
              boxShadow:
                page === count
                  ? "0 4px 6px -1px rgba(120, 121, 202, 0.4)"
                  : "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": {
                background:
                  page === count
                    ? "linear-gradient(135deg, #7879CA 0%, #A5A6F6 100%)"
                    : "#e0e0e0",
              },
            }}
          >
            {count}
          </Button>

          {/* Next Button */}
          <Button
            onClick={(e) => handlePageChange(e as any, page + 1)}
            disabled={page === count}
            sx={{
              minWidth: "30px",
              borderRadius: "50%",
              backgroundColor: "white",
              color: "black",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            <ChevronRight />
          </Button>
        </div>

        {/* Ripple effect */}
        {clickedPage && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.div
              initial={{ opacity: 0.7, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.4 }}
              transition={{ duration: 0.4 }}
              className="absolute top-1/2 left-0 w-full h-2 bg-blue-300 rounded-full transform -translate-y-1/2 filter blur-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPagination;

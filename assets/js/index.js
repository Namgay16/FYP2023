// Attach event listener to delete icon
console.log("sedrfghjkl;");
$(".delete").click(function () {
  console.log("delete");
  var id = $(this).attr("data-id");

  // Send AJAX request to delete block
  $.ajax({
    url: "http://localhost:5000/api/blocks/" + id,
    method: "DELETE",
    success: function (response) {
      // If the block was successfully deleted, display a success message and reload the page
      alert("Block deleted successfully!");
      location.reload();
    },
    error: function (error) {
      // If there was an error deleting the block, display an error message
      alert("Error deleting block: " + error.responseText);
    },
  });
});

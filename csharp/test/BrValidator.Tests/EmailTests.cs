using Xunit;

namespace BrValidator.Tests
{
    public class EmailTests
    {
        [Theory]
        [InlineData("user@example.com")]
        [InlineData("user@mail.example.com")]
        [InlineData("user+tag@example.com")]
        [InlineData("User@Example.COM")]
        [InlineData("  user@example.com  ")]
        [InlineData("first.last@sub.example.com.br")]
        [InlineData("a@b.co")]
        public void IsValid_AcceptsValid(string value)
        {
            Assert.True(Email.IsValid(value));
        }

        [Theory]
        [InlineData("userexample.com")]
        [InlineData("user@example")]
        [InlineData("user@@example.com")]
        [InlineData("us er@example.com")]
        [InlineData("user<>@example.com")]
        [InlineData("")]
        [InlineData("        ")]
        [InlineData("user@.com")]
        public void IsValid_RejectsInvalid(string value)
        {
            Assert.False(Email.IsValid(value));
        }

        [Fact]
        public void IsValid_RejectsTooLongEmail()
        {
            string longEmail = new string('a', 250) + "@example.com";
            Assert.False(Email.IsValid(longEmail));
        }

        [Fact]
        public void IsValid_RejectsTooLongLocalPart()
        {
            string longLocalPart = new string('a', 65) + "@example.com";
            Assert.False(Email.IsValid(longLocalPart));
        }

        [Theory]
        [InlineData("  user@example.com  ", "user@example.com")]
        [InlineData("User@Example.COM", "user@example.com")]
        [InlineData("user@example.com", "user@example.com")]
        public void Normalize(string input, string expected)
        {
            Assert.Equal(expected, Email.Normalize(input));
        }

        [Fact]
        public void Format()
        {
            Assert.Equal("user@example.com", Email.Format("  User@Example.COM  "));
        }
    }
}

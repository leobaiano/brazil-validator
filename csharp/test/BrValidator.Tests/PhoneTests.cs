using Xunit;

namespace BrValidator.Tests
{
    public class PhoneTests
    {
        [Theory]
        [InlineData("(11) 91234-5678")]
        [InlineData("11912345678")]
        [InlineData("(11) 2345-6789")]
        [InlineData("1123456789")]
        [InlineData("(21) 2345-6789")]
        [InlineData("11987654321")]
        [InlineData("8534567890")]
        public void IsValid_AcceptsValid(string value)
        {
            Assert.True(Phone.IsValid(value));
        }

        [Theory]
        [InlineData("(00) 91234-5678")]
        [InlineData("(20) 1234-5678")]
        [InlineData("(29) 91234-5678")]
        [InlineData("11812345678")]
        [InlineData("1161234567")]
        [InlineData("1191234567")]
        [InlineData("111234567")]
        [InlineData("119123456789")]
        [InlineData("(11) 9ABC-5678")]
        [InlineData("11+91234-5678")]
        [InlineData("")]
        [InlineData("        ")]
        [InlineData("1234")]
        [InlineData("11a12345678")]
        [InlineData("119123456789012")]
        public void IsValid_RejectsInvalid(string value)
        {
            Assert.False(Phone.IsValid(value));
        }

        [Theory]
        [InlineData("(11) 91234-5678", "11912345678")]
        [InlineData("(11) 2345-6789", "1123456789")]
        [InlineData("11912345678", "11912345678")]
        public void Normalize(string input, string expected)
        {
            Assert.Equal(expected, Phone.Normalize(input));
        }

        [Theory]
        [InlineData("11912345678", "(11) 91234-5678")]
        [InlineData("1123456789", "(11) 2345-6789")]
        [InlineData("(11) 91234-5678", "(11) 91234-5678")]
        [InlineData("123", "123")]
        public void Format(string input, string expected)
        {
            Assert.Equal(expected, Phone.Format(input));
        }
    }
}
